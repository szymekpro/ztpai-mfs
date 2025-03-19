from rest_framework.serializers import ModelSerializer # type: ignore
from .models import User

class ProfileSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email']

class UsersSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'role']
