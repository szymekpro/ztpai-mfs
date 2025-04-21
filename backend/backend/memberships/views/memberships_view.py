from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from ..models import MembershipType, UserMembership
from ..serializers import MembershipTypeSerializer, UserMembershipSerializer


class MembershipTypeViewSet(ModelViewSet):
    queryset = MembershipType.objects.all()
    serializer_class = MembershipTypeSerializer

    @action(detail=False, methods=["get"], url_path="my-memberships")
    def my_memberships(self, request):
        user_memberships = UserMembership.objects.filter(user=request.user)
        serializer = UserMembershipSerializer(user_memberships, many=True)
        return Response(serializer.data)


class UserMembershipViewSet(ModelViewSet):
    queryset = UserMembership.objects.all()
    serializer_class = UserMembershipSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserMembership.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

