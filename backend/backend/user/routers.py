from rest_framework.routers import DefaultRouter # type: ignore
from .views.user_view import CreateUserView

router = DefaultRouter()

#router.register(r'users', CreateUserView)

