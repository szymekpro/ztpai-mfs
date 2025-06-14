# gyms/views.py
from datetime import datetime, timedelta

from django.utils.timezone import localtime, now
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiResponse
from gyms.models import Gym, Trainer, TrainerService
from ..serializers import GymSerializer, TrainerSerializer, TrainerServiceSerializer
from trainings.models import ScheduledTraining


@extend_schema_view(
    list=extend_schema(
        summary="List of gyms",
        description="Returns a list of all available gyms.",
        responses={200: GymSerializer(many=True)}
    ),
    retrieve=extend_schema(
        summary="Gym details",
        description="Returns the details of a specific gym.",
        responses={200: GymSerializer, 404: OpenApiResponse(description="Gym not found")}
    ),
    create=extend_schema(
        summary="Add a gym",
        description="Adds a new gym to the system.",
        request=GymSerializer,
        responses={201: GymSerializer}
    ),
    update=extend_schema(
        summary="Update a gym",
        description="Updates the data of an existing gym.",
        request=GymSerializer,
        responses={200: GymSerializer}
    ),
    partial_update=extend_schema(
        summary="Partial update of a gym",
        description="Partially updates fields of an existing gym.",
        request=GymSerializer,
        responses={200: GymSerializer}
    ),
    destroy=extend_schema(
        summary="Delete a gym",
        description="Deletes a gym from the system.",
        responses={
            204: OpenApiResponse(description="No Content"),
            404: OpenApiResponse(description="Gym not found")
        }
    ),
)
class GymViewSet(ModelViewSet):
    queryset = Gym.objects.all()
    serializer_class = GymSerializer

    @extend_schema(
        summary="Unique cities",
        description="Returns a list of unique cities where gyms are located.",
        responses={
            200: OpenApiResponse(description="List of city names as strings in an array")
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
            200: TrainerSerializer(many=True),
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
        description="Returns a list of all available trainers.",
        responses={200: TrainerSerializer(many=True)}
    ),
    retrieve=extend_schema(
        summary="Trainer details",
        description="Returns the details of a specific trainer.",
        responses={200: TrainerSerializer, 404: OpenApiResponse(description="Trainer not found")}
    ),
    create=extend_schema(
        summary="Add a trainer",
        description="Adds a new trainer to the system.",
        request=TrainerSerializer,
        responses={201: TrainerSerializer}
    ),
    update=extend_schema(
        summary="Update a trainer",
        description="Updates the data of an existing trainer.",
        request=TrainerSerializer,
        responses={200: TrainerSerializer}
    ),
    partial_update=extend_schema(
        summary="Partial update of a trainer",
        description="Partially updates fields of an existing trainer.",
        request=TrainerSerializer,
        responses={200: TrainerSerializer}
    ),
    destroy=extend_schema(
        summary="Delete a trainer",
        description="Deletes a trainer from the system.",
        responses={
            204: OpenApiResponse(description="No Content"),
            404: OpenApiResponse(description="Trainer not found")
        }
    ),
)
class TrainerViewSet(ModelViewSet):
    queryset = Trainer.objects.all()
    serializer_class = TrainerSerializer

    @extend_schema(
        summary="Booked hours for trainer",
        description="Returns a list of booked hour slots (e.g. '09:00') for a specific date.",
        parameters=[
            {
                "name": "date",
                "required": True,
                "in": "query",
                "description": "Date in format YYYY-MM-DD",
                "schema": {"type": "string", "format": "date", "example": "2025-06-02"}
            }
        ],
        responses={
            200: OpenApiResponse(description="Object with booked_hours array, e.g. { 'booked_hours': ['09:00'] }"),
            400: OpenApiResponse(description="Missing or invalid date")
        }
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
            start_time__date=date,
        ).exclude(status='cancelled')

        booked_hours = [localtime(t.start_time).strftime('%H:%M') for t in trainings]
        return Response({"booked_hours": booked_hours})

    @extend_schema(
        summary="Booked hours for current and next month",
        description="Returns booked hours grouped by date for current and next month.",
        responses={
            200: OpenApiResponse(description="Object mapping dates to arrays of time slots, e.g. { '2025-06-02': ['10:00'] }")
        }
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
        description="Returns a list of services that trainer offers to clients.",
        responses={200: TrainerServiceSerializer(many=True)}
    )
    @action(detail=True, methods=['get'], url_path='available-services')
    def available_services(self, request, pk=None):
        trainer = self.get_object()
        services = trainer.available_services.all()
        serializer = TrainerServiceSerializer(services, many=True)
        return Response(serializer.data)

    @extend_schema(
        summary="Trainer's assigned gym",
        description="Returns the gym that the trainer is associated with.",
        responses={200: GymSerializer}
    )
    @action(detail=True, methods=['get'], url_path='trainer-gym')
    def trainer_gym(self, request, pk=None):
        trainer = self.get_object()
        serializer = GymSerializer(trainer.gym)
        return Response(serializer.data)

from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiResponse

@extend_schema_view(
    list=extend_schema(
        summary="List trainer services",
        description="Returns a list of all services offered by trainers.",
        responses={200: TrainerServiceSerializer(many=True)}
    ),
    retrieve=extend_schema(
        summary="Trainer service details",
        description="Returns details of a specific trainer service.",
        responses={200: TrainerServiceSerializer}
    ),
    create=extend_schema(
        summary="Add trainer service",
        description="Adds a new trainer service to the system.",
        request=TrainerServiceSerializer,
        responses={201: TrainerServiceSerializer}
    ),
    update=extend_schema(
        summary="Update trainer service",
        description="Updates an existing trainer service.",
        request=TrainerServiceSerializer,
        responses={200: TrainerServiceSerializer}
    ),
    partial_update=extend_schema(
        summary="Partial update of trainer service",
        description="Partially updates fields of a trainer service.",
        request=TrainerServiceSerializer,
        responses={200: TrainerServiceSerializer}
    ),
    destroy=extend_schema(
        summary="Delete trainer service",
        description="Deletes a trainer service from the system.",
        responses={204: OpenApiResponse(description="No Content")}
    ),
)
class TrainerServiceViewSet(ModelViewSet):
    queryset = TrainerService.objects.all()
    serializer_class = TrainerServiceSerializer
