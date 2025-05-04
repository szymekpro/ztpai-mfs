from rest_framework.routers import DefaultRouter
from .views.payments_view import PaymentViewSet

router = DefaultRouter()
router.register("payments", PaymentViewSet, basename="payments")
