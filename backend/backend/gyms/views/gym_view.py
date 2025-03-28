# gyms/views.py
from rest_framework.viewsets import ModelViewSet
from ..models import Gym, Trainer, TrainerAvailability
from ..serializers import GymSerializer, TrainerSerializer, TrainerAvailabilitySerializer

class GymViewSet(ModelViewSet):
    queryset = Gym.objects.all()
    serializer_class = GymSerializer


class TrainerViewSet(ModelViewSet):
    queryset = Trainer.objects.all()
    serializer_class = TrainerSerializer


class TrainerAvailabilityViewSet(ModelViewSet):
    queryset = TrainerAvailability.objects.all()
    serializer_class = TrainerAvailabilitySerializer
