from django.shortcuts import get_object_or_404 # type: ignore
from ..serializers import ProfileSerializer, UsersSerializer
from rest_framework.response import Response # type: ignore
from rest_framework.views import APIView # type: ignore
from rest_framework.permissions import AllowAny # type: ignore
from rest_framework import status # type: ignore
from ..models import User
from rest_framework.viewsets import ModelViewSet # type: ignore

class UserViewAPI(APIView):
    permission_classes = (AllowAny,)

    def get(self, request):
        user = get_object_or_404(User, email=self.request.user.email)
        user_serializer = ProfileSerializer(user)
        return Response(user_serializer.data)

    def put(self, request):
        user = get_object_or_404(User, email=self.request.user.email)
        serializer = UsersSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserViewAPI(APIView):
    permission_classes = (AllowAny,)

    def get(self, request):
        user = get_object_or_404(User, email=self.request.user.email)
        user_serializer = ProfileSerializer(user)
        return Response(user_serializer.data)

    def put(self, request):
        user = get_object_or_404(User, email=self.request.user.email)
        serializer = UsersSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UsersAPIView(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UsersSerializer
    http_method_names = ['get', 'post', 'put', 'delete']

    def delete(self, request, pk=None):
        try:
            user = self.get_object()
            user.delete()
            return Response({'message': 'User deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    def list(self, request):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, pk=None):
        try:
            user = self.get_object()
            serializer = self.get_serializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    def create(self, request):
        serializer = UsersSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = UsersSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)