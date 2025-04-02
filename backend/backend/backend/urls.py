"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from django.conf import settings

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from drf_spectacular.views import SpectacularAPIView # type: ignore
from drf_spectacular.views import SpectacularRedocView, SpectacularSwaggerView # type: ignore

from users import urls as user_urls
from users.routers import router as user_router

from gyms.routers import router as gyms_router

from memberships.routers import router as memberships_router


urlpatterns = [
    path('api/admin/', admin.site.urls),
    path('api/api-auth/', include("rest_framework.urls")),


    path("api/token/", TokenObtainPairView.as_view(), name="get_token"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"),

    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),

    path('api/', include(user_urls)),
    path('api/', include(user_router.urls)),

    path('api/', include(gyms_router.urls)),

    path('api/', include(memberships_router.urls)),

]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
