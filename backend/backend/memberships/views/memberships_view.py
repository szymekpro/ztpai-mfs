from django.contrib.contenttypes.models import ContentType
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from drf_spectacular.utils import (
    extend_schema, extend_schema_view, OpenApiResponse
)
from ..models import MembershipType, UserMembership
from payments.models import Payment
from ..serializers import MembershipTypeSerializer, UserMembershipSerializer
from django.utils.timezone import now


@extend_schema_view(
    list=extend_schema(
        summary="List all membership types",
        description="Returns a list of all available membership types."
    ),
    retrieve=extend_schema(
        summary="Retrieve membership type details",
        description="Returns details of a specific membership type."
    ),
    create=extend_schema(
        summary="Create a new membership type",
        description="Creates a new membership type with duration, price and description."
    ),
    update=extend_schema(
        summary="Update a membership type",
        description="Updates an existing membership type."
    ),
    partial_update=extend_schema(
        summary="Partially update a membership type",
        description="Partially updates fields of a membership type."
    ),
    destroy=extend_schema(
        summary="Delete a membership type",
        description="Deletes a membership type from the system."
    ),
)
class MembershipTypeViewSet(ModelViewSet):
    queryset = MembershipType.objects.all()
    serializer_class = MembershipTypeSerializer

    @extend_schema(
        summary="Get user memberships",
        description="Returns a list of all memberships assigned to the currently authenticated user.",
        responses={200: UserMembershipSerializer(many=True)}
    )
    @action(detail=False, methods=["get"], url_path="my-memberships")
    def my_memberships(self, request):
        user_memberships = UserMembership.objects.filter(user=request.user)
        serializer = UserMembershipSerializer(user_memberships, many=True)
        return Response(serializer.data)


@extend_schema_view(
    list=extend_schema(
        summary="List user's memberships",
        description="Returns all memberships that belong to the currently authenticated user."
    ),
    retrieve=extend_schema(
        summary="Get membership details",
        description="Returns detailed info about a specific user membership."
    ),
    create=extend_schema(
        summary="Create a user membership",
        description="Creates a membership and assigns it to the currently authenticated user."
    ),
    update=extend_schema(
        summary="Update user membership",
        description="Updates an existing user membership."
    ),
    partial_update=extend_schema(
        summary="Partially update user membership"
    ),
    destroy=extend_schema(
        summary="Delete a user membership",
        description="Deletes a user membership record."
    ),
)
class UserMembershipViewSet(ModelViewSet):
    queryset = UserMembership.objects.all()
    serializer_class = UserMembershipSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserMembership.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        user_membership = serializer.save(user=self.request.user)
        amount = user_membership.membership_type.price
        description = f"Payment for membership: {user_membership.membership_type.name}"
        content_type = ContentType.objects.get_for_model(user_membership)

        Payment.objects.create(
            user=self.request.user,
            amount=amount,
            status="pending",
            description=description,
            content_type=content_type,
            object_id=user_membership.id,
        )

    @action(detail=False, methods=["get"], url_path="active")
    def has_active_membership(self, request):
        active = self.get_queryset().filter(
            is_active=True).exists()
        return Response({"has_membership": active})