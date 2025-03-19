from django.conf import settings  # type: ignore
from django.contrib.auth import get_user_model  # type: ignore
from rest_framework import authentication  # type: ignore
from rest_framework.exceptions import AuthenticationFailed, ParseError  # type: ignore
from rest_framework.permissions import BasePermission  # type: ignore

User = get_user_model()


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'admin'


class IsOwner(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'owner'

