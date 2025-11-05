from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.core.validators import RegexValidator, MinLengthValidator, MaxLengthValidator

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
