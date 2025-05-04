from django.urls import path
#from .views.owner_view import OwnerAPIView, OwnerDetailsAPIView
#from .views.admin_view import AdminAPIView, AdminDetailsAPIView
from .views.user_view import RegisterView

urlpatterns = [

    #path('user/', UserViewAPI.as_view(), name='user'),

    path('user/register/', RegisterView.as_view(), name='register'),

    #path("owners/", AdminAPIView.as_view()),
    #path("owners/<int:pk>/", AdminDetailsAPIView.as_view()),

    #path("members/", OwnerAPIView.as_view()),
    #path("members/<int:pk>/", OwnerDetailsAPIView.as_view()),
]