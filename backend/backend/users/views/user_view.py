from django.shortcuts import get_object_or_404 # type: ignore
from rest_framework.decorators import action

from ..models import CustomUser
from ..serializers import UsersSerializer, RegisterSerializer
from rest_framework.response import Response # type: ignore
from rest_framework.views import APIView # type: ignore
from rest_framework.permissions import AllowAny, IsAuthenticated  # type: ignore
from rest_framework import status, generics  # type: ignore
from rest_framework.viewsets import ModelViewSet # type: ignore
from drf_spectacular.utils import extend_schema, OpenApiResponse

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

@extend_schema(
    request=RegisterSerializer,
    responses={
        201: OpenApiResponse(description="User successfully registered"),
        400: OpenApiResponse(description="Validation error")
    },
    summary="Register a new user",
    description="Public endpoint to register a new user. Creates a user with default role 'member'."
)
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Użytkownik zarejestrowany"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


from drf_spectacular.utils import extend_schema_view, extend_schema, OpenApiResponse

@extend_schema_view(
    list=extend_schema(
        summary="List all users",
        description="Admins and employees can view all users. Members cannot access this endpoint.",
        responses={200: UsersSerializer(many=True)}
    ),
    retrieve=extend_schema(
        summary="Get user details",
        description="Admins and employees can view any user. Members can view only themselves.",
        responses={200: UsersSerializer, 404: OpenApiResponse(description="Not found")}
    ),
    create=extend_schema(
        summary="Create user (admin use only)",
        description="Creates a new user. Typically used by admin or employee.",
        request=UsersSerializer,
        responses={201: UsersSerializer}
    ),
    update=extend_schema(
        summary="Update user data",
        description="Admins/employees can update any user. Members can update only themselves.",
        request=UsersSerializer,
        responses={200: UsersSerializer}
    ),
    partial_update=extend_schema(
        summary="Partially update user",
        description="Partial update of user data. Same rules as full update.",
        request=UsersSerializer,
        responses={200: UsersSerializer}
    ),
    destroy=extend_schema(
        summary="Delete user",
        description="Admins and employees can delete any user. Members cannot delete anyone.",
        responses={204: OpenApiResponse(description="User deleted")}
    ),
)
class UserViewSet(ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UsersSerializer
    permission_classes = [IsAuthenticated, IsAdminOrEmployeeOrSelf]

    def get_queryset(self):
        user = self.request.user
        if user.role in ("admin", "employee"):
            return CustomUser.objects.all()
        return CustomUser.objects.filter(id=user.id)

    @extend_schema(
        summary="Get current user info",
        description="Returns data for the currently authenticated user.",
        responses={200: UsersSerializer}
    )
    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        user = self.get_object()

        user = self.get_object()
        user.scheduled_trainings.update(status='cancelled')
        user.memberships.all().delete()

        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @extend_schema(
        summary="Verify user student status",
        description="Sets student status to true upon request.",
    )
    @action(detail=False, methods=["post"], permission_classes=[IsAuthenticated])
    def request_student_status(self, request):
        user = request.user
        user.is_student = True
        user.save()
        return Response({"detail": "Student status requested"}, status=status.HTTP_200_OK)

