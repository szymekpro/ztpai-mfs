'''from django.shortcuts import get_object_or_404  # type: ignore
from user.authentication import IsOwner
from rest_framework.response import Response  # type: ignore
from rest_framework.views import APIView  # type: ignore
#from ..models import User
from ..serializers import UsersSerializer

class OwnerAPIView(APIView):
    permission_classes = [IsOwner]
    queryset = User.objects.all()

    def get(self, request):
        users = User.objects.filter(role="member")
        serializer = UsersSerializer(users, many=True)
        return Response(serializer.data)


class OwnerDetailsAPIView(APIView):
    permission_classes = [IsOwner]

    def post(self, request, pk):
        user = get_object_or_404(User, pk=pk)
        user.save()
        serializedUser = UsersSerializer(user)
        return Response(serializedUser.data, status=200)

    def delete(self, request, pk):
        user = get_object_or_404(User, pk=pk)
        user.delete()
        return Response(status=200)
'''