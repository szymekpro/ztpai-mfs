from rest_framework.serializers import ModelSerializer # type: ignore
from django.contrib.auth.models import User

from .models import CustomUser


class ProfileSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email']

class UsersSerializer(ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["email", "password"]

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user
