from ..models import Payment
from rest_framework.permissions import IsAuthenticated
from ..serializers import PaymentsSerializer
from drf_spectacular.utils import (
    extend_schema, extend_schema_view, OpenApiResponse
)
from rest_framework.viewsets import ReadOnlyModelViewSet


@extend_schema_view(
    list=extend_schema(
        summary="List user payments",
        description="Returns all payments made by the currently authenticated user."
    ),
    retrieve=extend_schema(
        summary="Get payment details",
        description="Returns detailed info about a specific payment."
    )
)
class PaymentViewSet(ReadOnlyModelViewSet):
    serializer_class = PaymentsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Payment.objects.filter(user=self.request.user)

