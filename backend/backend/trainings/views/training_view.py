from django.contrib.contenttypes.models import ContentType
from rest_framework.viewsets import ModelViewSet
from ..models import ScheduledTraining
from ..serializers import ScheduledTrainingSerializer
from rest_framework.permissions import IsAuthenticated

from payments.models import Payment


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