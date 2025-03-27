from django.shortcuts import get_object_or_404  # type: ignore
'''from user.authentication import IsAdmin
from rest_framework.response import Response  # type: ignore
from rest_framework.views import APIView  # type: ignore
from ..models import User
from ..serializers import UsersSerializer


class AdminAPIView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        users = User.objects.filter(role="owner")
        serializer = UsersSerializer(users, many=True)
        return Response(serializer.data)

class AdminDetailsAPIView(APIView):
    permission_classes = [IsAdmin]

    def post(self, request, pk):
        user = get_object_or_404(User, pk=pk)
        user.save()
        serializedUser = UsersSerializer(user)
        return Response(serializedUser.data, status=200)

    def delete(self, request, pk):
        user = get_object_or_404(User, pk=pk)
        user.delete()
        return Response(status=200)'''