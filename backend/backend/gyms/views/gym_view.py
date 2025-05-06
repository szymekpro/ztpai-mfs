# gyms/views.py
from datetime import datetime

from django.utils.timezone import localtime
from drf_spectacular.types import OpenApiTypes
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiResponse
from ..models import Gym, Trainer, TrainerAvailability
from ..serializers import GymSerializer, TrainerSerializer, TrainerAvailabilitySerializer
from trainings.models import ScheduledTraining


@extend_schema_view(
    list=extend_schema(
        summary="List of gyms",
        description="Returns a list of all available gyms."
    ),
    retrieve=extend_schema(
        summary="Gym details",
        description="Returns the details of a specific gym."
    ),
    create=extend_schema(
        summary="Add a gym",
        description="Adds a new gym to the system."
    ),
    update=extend_schema(
        summary="Update a gym",
        description="Updates the data of an existing gym."
    ),
    partial_update=extend_schema(
        summary="Partial update of a gym"
    ),
    destroy=extend_schema(
        summary="Delete a gym",
        description="Deletes a gym from the system."
    ),
)
class GymViewSet(ModelViewSet):
    queryset = Gym.objects.all()
    serializer_class = GymSerializer

    @extend_schema(
        summary="Unique cities",
        description="Returns a list of unique cities where gyms are located.",
        responses={
            200: OpenApiResponse(description="List of cities (strings) as an array")
        }
    )
    @action(detail=False, methods=["get"], url_path="cities")
    def list_unique_cities(self, request):
        cities = Gym.objects.values_list("city", flat=True).distinct()
        return Response(cities)


@extend_schema_view(
    list=extend_schema(
        summary="List of trainers",
        description="Returns a list of all available trainers."
    ),
    retrieve=extend_schema(
        summary="Trainer details",
        description="Returns the details of a specific trainer."
    ),
    create=extend_schema(
        summary="Add a trainer",
        description="Adds a new trainer to the system."
    ),
    update=extend_schema(
        summary="Update a trainer",
        description="Updates the data of an existing trainer."
    ),
    partial_update=extend_schema(
        summary="Partial update of a trainer"
    ),
    destroy=extend_schema(
        summary="Delete a trainer",
        description="Deletes a trainer from the system."
    ),
)
class TrainerViewSet(ModelViewSet):
    queryset = Trainer.objects.all()
    serializer_class = TrainerSerializer

    @extend_schema(
        summary="Booked hours for trainer",
        description="Returns a list of booked hour slots (e.g. '09:00') for a specific date.",
    )
    @action(detail=True, methods=['get'], url_path='booked-hours')
    def booked_hours(self, request, pk=None):
        date_str = request.GET.get('date')
        if not date_str:
            return Response({"error": "Missing date parameter"}, status=400)

        try:
            date = datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            return Response({"error": "Invalid date format. Example: YYYY-MM-DD"}, status=400)

        trainings = ScheduledTraining.objects.filter(
            trainer_id=pk,
            start_time__date=date
        )

        booked_hours = [localtime(t.start_time).strftime('%H:%M') for t in trainings]
        return Response({"booked_hours": booked_hours})

@extend_schema_view(
    list=extend_schema(
        summary="Trainer availabilities",
        description="Returns all trainer availabilities."
    ),
    retrieve=extend_schema(
        summary="Availability details",
        description="Returns the availability details of a specific trainer."
    ),
    create=extend_schema(
        summary="Add availability",
        description="Adds a new availability entry for a trainer."
    ),
    update=extend_schema(
        summary="Update availability",
        description="Updates an existing availability entry."
    ),
    partial_update=extend_schema(
        summary="Partial update of availability"
    ),
    destroy=extend_schema(
        summary="Delete availability",
        description="Deletes a trainer's availability entry."
    ),
)
class TrainerAvailabilityViewSet(ModelViewSet):
    queryset = TrainerAvailability.objects.all()
    serializer_class = TrainerAvailabilitySerializer
