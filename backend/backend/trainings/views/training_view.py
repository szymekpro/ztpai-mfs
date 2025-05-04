from rest_framework.viewsets import ModelViewSet
from ..models import ScheduledTraining
from ..serializers import ScheduledTrainingSerializer
from rest_framework.permissions import IsAuthenticated

class ScheduledTrainingViewSet(ModelViewSet):
    queryset = ScheduledTraining.objects.all()
    serializer_class = ScheduledTrainingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ScheduledTraining.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
