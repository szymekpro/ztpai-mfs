import re

from rest_framework import serializers
from django.core.validators import RegexValidator
from rest_framework.serializers import ModelSerializer # type: ignore
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.models import User

from .models import CustomUser

class UsersSerializer(ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "phone",
            "street",
            "street_number",
            "city",
            "postal_code",
            "role",
            "is_student",
        ]
        read_only_fields = ["id", "email"]

    def validate_role(self, value):
        user = self.context["request"].user
        if user.role not in ("admin", "employee"):
            raise serializers.ValidationError("You are not allowed to change role.")
        return value

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    email = serializers.EmailField()

    postal_code = serializers.CharField(
        validators=[
            RegexValidator(
                regex=r"^\d{2}-\d{3}$",
                message="Postal code must be in format XX-XXX"
            )
        ]
    )

    phone = serializers.CharField(
        validators=[
            RegexValidator(
                regex=r"^\d{9}$",
                message="Phone number must contain 9 digits"
            )
        ]
    )

    class Meta:
        model = CustomUser
        fields = [
            "email",
            "password",
            "first_name",
            "last_name",
            "phone",
            "street",
            "street_number",
            "city",
            "postal_code"
        ]


    def validate_first_name(self, value):
        if not value.isalpha():
            raise serializers.ValidationError("Name can only contain letters.")
        return value

    def validate_last_name(self, value):
        if not value.isalpha():
            raise serializers.ValidationError("Last name can only contain letters.")
        return value

    def validate_street(self, value):
        if not re.match(r"^[\w\s\.\-]+$", value):
            raise serializers.ValidationError("Street contains wrong characters.")
        return value

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = CustomUser(**validated_data)
        user.set_password(password)
        user.save()
        return user


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["role"] = user.role
        return token
