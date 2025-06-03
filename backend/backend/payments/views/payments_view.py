from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework import status
from ..models import Payment
from rest_framework.permissions import IsAuthenticated
from ..serializers import PaymentsSerializer, PaymentUpdateSerializer, PaymentCreateSerializer
from drf_spectacular.utils import (
    extend_schema, extend_schema_view, OpenApiResponse
)
from rest_framework.viewsets import ModelViewSet


@extend_schema_view(
    list=extend_schema(
        summary="List user payments",
        description="Returns all payments made by the currently authenticated user. "
                    "Members see only their own payments.",
        responses={200: PaymentsSerializer(many=True)}
    ),
    retrieve=extend_schema(
        summary="Get payment details",
        description="Returns detailed info about a specific payment. "
                    "Members can access only their own payments.",
        responses={
            200: PaymentsSerializer,
            403: OpenApiResponse(description="Forbidden"),
            404: OpenApiResponse(description="Not Found"),
        }
    ),
    create=extend_schema(
        summary="Create payment",
        description="Create a new payment. Only admins and employees are allowed.",
        request=PaymentsSerializer,
        responses={
            201: PaymentsSerializer,
            403: OpenApiResponse(description="Forbidden"),
        }
    ),
    partial_update=extend_schema(
        summary="Partially update payment",
        description="Allows partial update of payment. "
                    "Members can only set their own payment's status to 'paid'. "
                    "Admins and employees can modify all fields.",
        request=PaymentUpdateSerializer,
        responses={
            200: PaymentsSerializer,
            403: OpenApiResponse(description="Forbidden"),
            404: OpenApiResponse(description="Not Found"),
        }
    ),
    update=extend_schema(
        summary="Fully update payment",
        description="Allows full update of a payment. Only admins and employees are allowed.",
        request=PaymentUpdateSerializer,
        responses={
            200: PaymentsSerializer,
            403: OpenApiResponse(description="Forbidden"),
            404: OpenApiResponse(description="Not Found"),
        }
    ),
    destroy=extend_schema(
        summary="Delete payment",
        description="Delete a payment. Only admins and employees are allowed.",
        responses={
            204: OpenApiResponse(description="No Content"),
            403: OpenApiResponse(description="Forbidden"),
            404: OpenApiResponse(description="Not Found"),
        }
    ),
)
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
        if self.action == "create":
            return PaymentCreateSerializer
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

