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
        if user.role == "admin":
            return Payment.objects.all()
        elif user.role == "employee":
            return Payment.objects.all()
        else:
            return Payment.objects.filter(user=user)

    def get_serializer_class(self):
        user = self.request.user
        if self.action == "partial_update":
            if user.role == "employee":
                return PaymentUpdateSerializer
        return PaymentsSerializer

    def partial_update(self, request, *args, **kwargs):
        payment = self.get_object()
        user = request.user

        if user.role == "admin" or payment.user == user:
            return super().partial_update(request, *args, **kwargs)

        elif user.role == "employee":
            self.serializer_class = PaymentUpdateSerializer
            return super().partial_update(request, *args, **kwargs)

        return Response({"detail": "Not authorized."}, status=status.HTTP_403_FORBIDDEN)
