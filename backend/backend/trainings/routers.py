from rest_framework.routers import DefaultRouter
from .views.training_view import ScheduledTrainingViewSet

router = DefaultRouter()

router.register(r'trainings', ScheduledTrainingViewSet)

