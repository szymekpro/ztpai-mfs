from django.shortcuts import get_object_or_404 # type: ignore

from ..models import CustomUser
from ..serializers import UsersSerializer, RegisterSerializer
from rest_framework.response import Response # type: ignore
from rest_framework.views import APIView # type: ignore
from rest_framework.permissions import AllowAny # type: ignore
from rest_framework import status, generics  # type: ignore
from rest_framework.viewsets import ModelViewSet # type: ignore
from drf_spectacular.utils import extend_schema

class RegisterView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(
        request=RegisterSerializer,
        responses={201: None, 400: dict},
        description="Creates a new user based on data."
    )
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Użytkownik zarejestrowany"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserViewSet(ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UsersSerializer
