from django.utils import timezone
from datetime import timedelta

from django.contrib.contenttypes.models import ContentType
from rest_framework import status
from rest_framework.exceptions import ValidationError
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


@extend_schema_view(
    list=extend_schema(
        summary="List all membership types",
        description="Returns a list of all available membership types.",
        responses={200: MembershipTypeSerializer(many=True)}
    ),
    retrieve=extend_schema(
        summary="Retrieve membership type details",
        description="Returns details of a specific membership type.",
        responses={200: MembershipTypeSerializer}
    ),
    create=extend_schema(
        summary="Create a new membership type",
        description="Creates a new membership type with duration, price and description.",
        request=MembershipTypeSerializer,
        responses={201: MembershipTypeSerializer}
    ),
    update=extend_schema(
        summary="Update a membership type",
        description="Updates an existing membership type.",
        request=MembershipTypeSerializer,
        responses={200: MembershipTypeSerializer}
    ),
    partial_update=extend_schema(
        summary="Partially update a membership type",
        description="Partially updates fields of a membership type.",
        request=MembershipTypeSerializer,
        responses={200: MembershipTypeSerializer}
    ),
    destroy=extend_schema(
        summary="Delete a membership type",
        description="Deletes a membership type from the system.",
        responses={204: OpenApiResponse(description="No Content")}
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
        description="Returns all memberships that belong to the currently authenticated user.",
        responses={200: UserMembershipSerializer(many=True)}
    ),
    retrieve=extend_schema(
        summary="Get membership details",
        description="Returns detailed info about a specific user membership.",
        responses={200: UserMembershipSerializer}
    ),
    create=extend_schema(
        summary="Create a user membership",
        description="Creates a membership and assigns it to the currently authenticated user. "
                    "Also generates a pending payment for this membership.",
        request=UserMembershipSerializer,
        responses={201: UserMembershipSerializer}
    ),
    update=extend_schema(
        summary="Update user membership",
        description="Updates an existing user membership.",
        request=UserMembershipSerializer,
        responses={200: UserMembershipSerializer}
    ),
    partial_update=extend_schema(
        summary="Partially update user membership",
        description="Partially updates fields of a user membership.",
        request=UserMembershipSerializer,
        responses={200: UserMembershipSerializer}
    ),
    destroy=extend_schema(
        summary="Delete a user membership",
        description="Deletes a user membership record.",
        responses={204: OpenApiResponse(description="No Content")}
    ),
)
class UserMembershipViewSet(ModelViewSet):
    queryset = UserMembership.objects.all()
    serializer_class = UserMembershipSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "employee" or user.role == "admin":
            return UserMembership.objects.all()
        return UserMembership.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        user = self.request.user
        membership_type = serializer.validated_data['membership_type']

        has_active = UserMembership.objects.filter(
            user=user,
            membership_type=membership_type,
            is_active=True
        ).exists()

        if has_active:
            raise ValidationError({"non_field_errors": ["You already have an active membership of this type."]})

        existing = UserMembership.objects.filter(
            user=user,
            membership_type=membership_type,
            is_active=False
        ).first()

        start_date = timezone.now().date()
        end_date = start_date + timedelta(days=membership_type.duration_days)

        if existing:
            existing.start_date = start_date
            existing.end_date = end_date
            existing.is_active = True
            existing.save()
            user_membership = existing
        else:
            user_membership = serializer.save(
                user=user,
                start_date=start_date,
                end_date=end_date,
                is_active=True,
            )

        amount = membership_type.price
        description = f"Payment for membership: {membership_type.name}"
        content_type = ContentType.objects.get_for_model(user_membership)

        Payment.objects.create(
            user=user,
            amount=amount,
            status="pending",
            description=description,
            content_type=content_type,
            object_id=user_membership.id,
        )

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        user = request.user

        if user.role not in ["admin", "employee"]:
            return Response(
                {"detail": "You are not authorized to perform this action."},
                status=status.HTTP_403_FORBIDDEN,
            )

        is_active = request.data.get("is_active")
        if is_active is not None:
            is_active = str(is_active).lower() == "true"

            instance.is_active = is_active
            if is_active:
                instance.start_date = timezone.now().date()
                instance.end_date = instance.start_date + timedelta(days=30)
            instance.save()

            serializer = self.get_serializer(instance)
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(
            {"detail": "No supported fields provided."},
            status=status.HTTP_400_BAD_REQUEST,
        )


    @extend_schema(
        summary="Check if user has active membership",
        description="Returns whether the currently authenticated user has an active membership.",
        responses={200: OpenApiResponse(description='{"has_membership": true/false}')}
    )
    @action(detail=False, methods=["get"], url_path="active")
    def has_active_membership(self, request):
        active = self.get_queryset().filter(is_active=True).exists()
        return Response({"has_membership": active})
