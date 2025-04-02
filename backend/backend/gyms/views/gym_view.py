# gyms/views.py
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from ..models import Gym, Trainer, TrainerAvailability
from ..serializers import GymSerializer, TrainerSerializer, TrainerAvailabilitySerializer

class GymViewSet(ModelViewSet):
    queryset = Gym.objects.all()
    serializer_class = GymSerializer

    @action(detail=False, methods=["get"], url_path="cities")
    def list_unique_cities(self, request):
        cities = Gym.objects.values_list("city", flat=True).distinct()
        return Response(cities)



class TrainerViewSet(ModelViewSet):
    queryset = Trainer.objects.all()
    serializer_class = TrainerSerializer


class TrainerAvailabilityViewSet(ModelViewSet):
    queryset = TrainerAvailability.objects.all()
    serializer_class = TrainerAvailabilitySerializer
