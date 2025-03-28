from rest_framework.routers import DefaultRouter
from .views.memberships_view import UserMembershipViewSet

router = DefaultRouter()

router.register(r'memberships', UserMembershipViewSet)