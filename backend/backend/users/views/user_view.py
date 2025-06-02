from django.shortcuts import get_object_or_404 # type: ignore
from rest_framework.decorators import action

from ..models import CustomUser
from ..serializers import UsersSerializer, RegisterSerializer
from rest_framework.response import Response # type: ignore
from rest_framework.views import APIView # type: ignore
from rest_framework.permissions import AllowAny, IsAuthenticated  # type: ignore
from rest_framework import status, generics  # type: ignore
from rest_framework.viewsets import ModelViewSet # type: ignore
from drf_spectacular.utils import extend_schema


from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsAdminOrEmployeeOrSelf(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.role in ("admin", "employee"):
            return True
        return obj == request.user

    def has_permission(self, request, view):
        if view.action in ["list", "retrieve", "destroy", "update", "partial_update"]:
            return request.user.is_authenticated and request.user.role in ("admin", "employee")
        return request.user.is_authenticated

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
    permission_classes = [IsAuthenticated, IsAdminOrEmployeeOrSelf]

    def get_queryset(self):
        user = self.request.user
        if user.role in ("admin", "employee"):
            return CustomUser.objects.all()
        return CustomUser.objects.filter(id=user.id)

    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

