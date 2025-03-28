from rest_framework.routers import DefaultRouter
from .views.gym_view import GymViewSet

router = DefaultRouter()

router.register(r'gyms', GymViewSet)

