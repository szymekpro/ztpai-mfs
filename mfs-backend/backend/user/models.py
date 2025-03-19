from django.db import models
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin

class CustomUserManager(BaseUserManager):
    def create_user(self, email):
        if not email:
            raise ValueError("No email provided")

        email = self.normalize_email(email)
        user = self.model(email=email)
        user.save()

        return user

class User(AbstractBaseUser, PermissionsMixin):
    id = models.CharField(max_length=500, blank=True, unique=True, primary_key=True)
    email = models.EmailField(max_length=100, unique=True)
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('owner', 'Owner'),
        ('employee', 'Employee'),
        ('member', 'Member')
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='member')
    USERNAME_FIELD = 'email'
    objects = CustomUserManager()