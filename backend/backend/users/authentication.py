from datetime import datetime, timedelta

from django.conf import settings  # type: ignore
from django.contrib.auth import get_user_model  # type: ignore
from rest_framework import authentication  # type: ignore
from rest_framework.exceptions import AuthenticationFailed, ParseError  # type: ignore
from rest_framework.permissions import BasePermission  # type: ignore
import jwt # type: ignore

User = get_user_model()

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'admin'

class IsEmployee(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'employee'

class IsMember(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'member'


class JWTAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        jwt_token = request.META.get('HTTP_AUTHORIZATION')
        if jwt_token is None:
            return None
        jwt_token = JWTAuthentication.get_the_token_from_header(jwt_token)

        try:
            payload = jwt.decode(jwt_token, settings.SECRET_KEY, algorithms=['HS256'])
        except jwt.exceptions.InvalidSignatureError:
            raise AuthenticationFailed('Invalid signature')
        except jwt.exceptions.DecodeError:
            raise AuthenticationFailed('Invalid token')

        email = payload.get('email')
        if email is None:
            raise AuthenticationFailed('User identifier not found in JWT')

        user = User.objects.filter(email=email).first()
        if user is None:
            raise AuthenticationFailed('User not found')

        request.user = user
        return user, payload

    def authenticate_header(self, request):
        return 'Bearer'

    @classmethod
    def create_jwt(cls, user):
        payload = {
            'email': user.email,
            'role': user.role,
            'exp': int((datetime.now() + timedelta(
                hours=getattr(settings, 'JWT_CONFIG', {}).get('TOKEN_LIFETIME_HOURS', 1))).timestamp()),
            'iat': datetime.now().timestamp()
        }

        jwt_token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')

        return jwt_token

    @classmethod
    def create_refresh_token(cls, user):
        refresh_payload = {
            'email': user.email,
            'type': 'refresh',
            'exp': int((datetime.now() + timedelta(
                hours=getattr(settings, 'JWT_CONFIG', {}).get('REFRESH_TOKEN_LIFETIME_HOURS', 16))).timestamp()),
            'iat': datetime.now().timestamp()
        }

        refresh_token = jwt.encode(refresh_payload, settings.SECRET_KEY, algorithm='HS256')
        return refresh_token

    @classmethod
    def validate_refresh_token(cls, token):
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            if payload.get('type') != 'refresh':
                raise AuthenticationFailed('Invalid refresh token type')
            return payload
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Refresh token has expired')
        except jwt.exceptions.DecodeError:
            raise AuthenticationFailed('Invalid refresh token')

    @classmethod
    def refresh_access_token(cls, refresh_token):
        payload = cls.validate_refresh_token(refresh_token)
        email = payload.get('email')

        if email is None:
            raise AuthenticationFailed('Email not found in refresh token')

        user = User.objects.filter(email=email).first()
        if user is None:
            raise AuthenticationFailed('User not found')

        return cls.create_jwt(user)

    @classmethod
    def get_the_token_from_header(cls, token):
        token = token.replace('Bearer', '').replace(' ', '')
        return token

    @staticmethod
    def get_email_from_token(token):
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            return payload.get('email')
        except jwt.exceptions.DecodeError:
            raise ParseError('Invalid token')

