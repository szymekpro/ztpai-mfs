from rest_framework.routers import DefaultRouter # type: ignore
from .views.user_view import UsersAPIView

router = DefaultRouter()

router.register(r'users', UsersAPIView)

