from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

class UserAdmin(BaseUserAdmin):
    # Fields to display in the list view
    list_display = ('email', 'name', 'phone', 'gender', 'is_staff', 'is_superuser')
    list_filter = ('is_staff', 'is_superuser', 'gender')

    # Fields to edit/add in admin form
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('name', 'phone', 'address', 'age', 'gender', 'adhaar_number')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
    )

    # Fields when adding a new user in admin
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'name', 'phone', 'address', 'age', 'gender', 'adhaar_number', 'password1', 'password2'),
        }),
    )

    search_fields = ('email', 'name', 'phone', 'adhaar_number')
    ordering = ('email',)
    filter_horizontal = ('groups', 'user_permissions')

admin.site.register(User, UserAdmin)
