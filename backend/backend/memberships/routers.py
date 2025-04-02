from rest_framework.routers import DefaultRouter
from .views.memberships_view import UserMembershipViewSet, MembershipTypeViewSet

router = DefaultRouter()

router.register(r'membership-types', MembershipTypeViewSet, basename='membership-type')
router.register(r'user-memberships', UserMembershipViewSet, basename='user-membership')