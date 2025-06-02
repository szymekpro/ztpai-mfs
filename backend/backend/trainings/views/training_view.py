from django.contrib.contenttypes.models import ContentType
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiResponse

from ..models import ScheduledTraining
from ..serializers import ScheduledTrainingSerializer
from payments.models import Payment


@extend_schema_view(
    list=extend_schema(
        summary="List user's scheduled trainings",
        description="Returns a list of scheduled trainings for the currently authenticated user.",
        responses={200: ScheduledTrainingSerializer(many=True)}
    ),
    retrieve=extend_schema(
        summary="Retrieve training details",
        description="Returns details of a specific training if it belongs to the user.",
        responses={200: ScheduledTrainingSerializer, 404: OpenApiResponse(description="Training not found")}
    ),
    create=extend_schema(
        summary="Create a new training",
        description="Creates a new training and generates a pending payment.",
        request=ScheduledTrainingSerializer,
        responses={201: ScheduledTrainingSerializer, 400: OpenApiResponse(description="Validation error")}
    ),
    update=extend_schema(
        summary="Update training",
        description="Fully updates a scheduled training.",
        request=ScheduledTrainingSerializer,
        responses={200: ScheduledTrainingSerializer, 400: OpenApiResponse(description="Validation error")}
    ),
    partial_update=extend_schema(
        summary="Partial update of training",
        description="Partially updates fields of an existing training.",
        request=ScheduledTrainingSerializer,
        responses={200: ScheduledTrainingSerializer, 400: OpenApiResponse(description="Validation error")}
    ),
    destroy=extend_schema(
        summary="Delete a training",
        description="Deletes a scheduled training belonging to the user.",
        responses={204: OpenApiResponse(description="No Content"), 404: OpenApiResponse(description="Training not found")}
    ),
)
class ScheduledTrainingViewSet(ModelViewSet):
    queryset = ScheduledTraining.objects.all()
    serializer_class = ScheduledTrainingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ScheduledTraining.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        training = serializer.save(user=self.request.user)
        amount = training.service_type.price

        Payment.objects.create(
            amount=amount,
            status='pending',
            description=f"Payment for training: {training.service_type.name}",
            user=self.request.user,
            content_type=ContentType.objects.get_for_model(ScheduledTraining),
            object_id=training.id
        )
