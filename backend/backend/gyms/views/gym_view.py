# gyms/views.py
from datetime import datetime, timedelta

from django.utils.timezone import localtime, now
from drf_spectacular.types import OpenApiTypes
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiResponse
from ..models import Gym, Trainer, TrainerAvailability, TrainerService
from ..serializers import GymSerializer, TrainerSerializer, TrainerAvailabilitySerializer, TrainerServiceSerializer
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

    @extend_schema(
        summary="List of trainers for a gym",
        description="Returns a list of trainers working at a specific gym.",
        responses={
            200: OpenApiResponse(description="List of trainers", response=TrainerSerializer(many=True)),
            404: OpenApiResponse(description="Gym not found")
        }
    )
    @action(detail=True, methods=["get"], url_path="trainers")
    def list_gym_trainers(self, request, pk=None):
        try:
            gym = self.get_object()
        except Gym.DoesNotExist:
            return Response({"detail": "Gym not found."}, status=404)

        trainers = gym.trainers.all()
        serializer = TrainerSerializer(trainers, many=True, context={"request": request})
        return Response(serializer.data)


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

    @extend_schema(
        summary="Booked hours for current and next month",
        description="Returns booked hours grouped by date for current and next month."
    )
    @action(detail=True, methods=['get'], url_path='booked-hours-range')
    def booked_hours_range(self, request, pk=None):
        today = now().date()
        first_day_this_month = today.replace(day=1)
        first_day_next_month = (first_day_this_month + timedelta(days=32)).replace(day=1)
        first_day_month_after = (first_day_next_month + timedelta(days=32)).replace(day=1)

        trainings = ScheduledTraining.objects.filter(
            trainer_id=pk,
            start_time__date__gte=first_day_this_month,
            start_time__date__lt=first_day_month_after,
            status__in=["scheduled", "completed"]
        )

        result = {}
        for training in trainings:
            date = localtime(training.start_time).date().isoformat()
            hour = localtime(training.start_time).strftime('%H:%M')
            result.setdefault(date, []).append(hour)

        return Response(result)

    @extend_schema(
        summary="Trainer's available services for clients",
        description="Returns a list of services that trainer offers for client.",
    )
    @action(detail=True, methods=['get'], url_path='available-services')
    def available_services(self, request, pk=None):
        trainer = self.get_object()
        services = trainer.available_services.all()
        serializer = TrainerServiceSerializer(services, many=True)
        return Response(serializer.data)

    @extend_schema(
        summary="Trainer's available gym for clients",
        description="Returns a gym that trainer is available on.",
    )
    @action(detail=True, methods=['get'], url_path='trainer-gym')
    def trainer_gym(self, request, pk=None):
        trainer = self.get_object()
        serializer = GymSerializer(trainer.gym)
        return Response(serializer.data)


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


class TrainerServiceViewSet(ModelViewSet):
    queryset = TrainerService.objects.all()
    serializer_class = TrainerServiceSerializer
