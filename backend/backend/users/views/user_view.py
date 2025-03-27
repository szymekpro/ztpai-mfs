from django.shortcuts import get_object_or_404 # type: ignore

from ..models import CustomUser
from ..serializers import ProfileSerializer, UsersSerializer
from rest_framework.response import Response # type: ignore
from rest_framework.views import APIView # type: ignore
from rest_framework.permissions import AllowAny # type: ignore
from rest_framework import status, generics  # type: ignore
#from ..models import User
from django.contrib.auth.models import User
from rest_framework.viewsets import ModelViewSet # type: ignore

class CreateUserView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UsersSerializer
    permission_classes = [AllowAny]

class UserViewSet(ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UsersSerializer
