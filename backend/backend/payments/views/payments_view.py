from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework import status
from ..models import Payment
from rest_framework.permissions import IsAuthenticated
from ..serializers import PaymentsSerializer, PaymentUpdateSerializer
from drf_spectacular.utils import (
    extend_schema, extend_schema_view, OpenApiResponse
)
from rest_framework.viewsets import ModelViewSet


@extend_schema_view(
    list=extend_schema(
        summary="List user payments",
        description="Returns all payments made by the currently authenticated user."
    ),
    retrieve=extend_schema(
        summary="Get payment details",
        description="Returns detailed info about a specific payment."
    ),
    patch=extend_schema(
        summary="Patch payment details",
        description="Patch payment details made by the currently authenticated employee/admin."
))
class PaymentViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ("admin", "employee"):
            return Payment.objects.all()
        return Payment.objects.filter(user=user)

    def get_serializer_class(self):
        if self.action == "partial_update":
            return PaymentUpdateSerializer
        return PaymentsSerializer

    def partial_update(self, request, *args, **kwargs):
        user = request.user
        instance = self.get_object()

        if user.role == "member":
            if instance.user != user:
                raise PermissionDenied("You can't modify someone else's payment.")
            if request.data.get("status") != "paid" or len(request.data) > 1:
                raise PermissionDenied("You can only mark your payment as paid.")
        return super().partial_update(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        if request.user.role == "member":
            raise PermissionDenied("Members cannot create payments.")
        return super().create(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        if request.user.role == "member":
            raise PermissionDenied("Members cannot delete payments.")
        return super().destroy(request, *args, **kwargs)

