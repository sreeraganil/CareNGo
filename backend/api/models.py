from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.core.validators import RegexValidator, MinLengthValidator, MaxLengthValidator
from django.conf import settings


class UserManager(BaseUserManager):
    def create_user(self, email, name, phone, address, age, gender, adhaar_number, password=None):
        if not email:
            raise ValueError("Users must have an email address")
        if not adhaar_number or len(adhaar_number) != 12:
            raise ValueError("Aadhaar number must be exactly 12 digits")

        email = self.normalize_email(email)
        user = self.model(
            email=email,
            name=name,
            phone=phone,
            address=address,
            age=age,
            gender=gender,
            adhaar_number=adhaar_number
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, phone, address, age, gender, adhaar_number, password=None):
        user = self.create_user(
            email=email,
            name=name,
            phone=phone,
            address=address,
            age=age,
            gender=gender,
            adhaar_number=adhaar_number,
            password=password
        )
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser, PermissionsMixin):
    GENDER_CHOICES = (
        ('Male', 'Male'),
        ('Female', 'Female'),
        ('Other', 'Other')
    )

    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)
    address = models.TextField()
    age = models.PositiveIntegerField()
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    adhaar_number = models.CharField(
        max_length=12,
        unique=True,
        validators=[
            RegexValidator(r'^\d{12}$', "Aadhaar number must be exactly 12 digits"),
            MinLengthValidator(12),
            MaxLengthValidator(12)
        ]
    )
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name', 'phone', 'address', 'age', 'gender', 'adhaar_number']

    def __str__(self):
        return self.email
    


class Booking(models.Model):
    RIDE_TYPES = [
        ('Standard', 'Standard SafeRide'),
        ('Women Only', 'Women Only'),
        ('Kids Friendly', 'Kids Friendly'),
        ('Wheelchair Accessible', 'Wheelchair Accessible'),
        ('Elderly Care', 'Elderly Care'),
        ('Medical Transport', 'Medical Transport'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bookings')
    booking_type = models.CharField(max_length=20, choices=[('myself', 'Myself'), ('others', 'Others')])

    # passenger (for others)
    passenger_name = models.CharField(max_length=100, blank=True, null=True)
    passenger_aadhaar = models.CharField(max_length=12, blank=True, null=True)
    passenger_phone = models.CharField(max_length=15, blank=True, null=True)
    passenger_age = models.PositiveIntegerField(blank=True, null=True)
    passenger_gender = models.CharField(max_length=20, blank=True, null=True)
    passenger_relationship = models.CharField(max_length=50, blank=True, null=True)
    special_requirements = models.JSONField(default=list, blank=True)  # array of strings

    # ride details
    pickup_location = models.CharField(max_length=255)
    destination = models.CharField(max_length=255)
    ride_type = models.CharField(max_length=30, choices=RIDE_TYPES)
    passengers_count = models.PositiveIntegerField(default=1)

    # emergency contact (for "others" booking)
    emergency_contact_name = models.CharField(max_length=100, blank=True, null=True)
    emergency_contact_phone = models.CharField(max_length=15, blank=True, null=True)

    status = models.CharField(max_length=20, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.name} → {self.destination} ({self.ride_type})"

