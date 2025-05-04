from rest_framework.routers import DefaultRouter # type: ignore
from .views.user_view import UserViewSet

router = DefaultRouter()

router.register(r'users', UserViewSet)

