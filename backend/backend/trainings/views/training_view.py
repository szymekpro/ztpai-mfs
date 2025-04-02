from rest_framework.viewsets import ModelViewSet
from ..models import ScheduledTraining
from ..serializers import ScheduledTrainingSerializer

class ScheduledTrainingViewSet(ModelViewSet):
    queryset = ScheduledTraining.objects.all()
    serializer_class = ScheduledTrainingSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
