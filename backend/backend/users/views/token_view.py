from rest_framework_simplejwt.views import TokenObtainPairView
from drf_spectacular.utils import extend_schema, OpenApiExample, OpenApiResponse
from ..serializers import MyTokenObtainPairSerializer


@extend_schema(
    summary="Obtain JWT token pair",
    description="Authenticates user with email and password and returns JWT access and refresh tokens.",
    request=MyTokenObtainPairSerializer,
    responses={
        200: OpenApiResponse(
            description="Successfully authenticated. Returns access and refresh tokens.",
            examples=[
                OpenApiExample(
                    "JWT Token Response",
                    value={
                        "access": "eyJ0eXAiOiJKV1QiLCJh...",
                        "refresh": "eyJ0eXAiOiJKV1QiLCJh..."
                    },
                    response_only=True
                )
            ]
        ),
        401: OpenApiResponse(description="Invalid credentials or inactive account")
    }
)
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
