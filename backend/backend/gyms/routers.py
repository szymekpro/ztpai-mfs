from rest_framework.routers import DefaultRouter
from .views.gym_view import GymViewSet, TrainerViewSet, TrainerServiceViewSet

router = DefaultRouter()

router.register(r'gyms', GymViewSet)
router.register(r'trainers', TrainerViewSet)
router.register(r'services', TrainerServiceViewSet)

