from rest_framework.viewsets import ModelViewSet
from ..models import MembershipType, UserMembership
from ..serializers import MembershipTypeSerializer, UserMembershipSerializer


class MembershipTypeViewSet(ModelViewSet):
    queryset = MembershipType.objects.all()
    serializer_class = MembershipTypeSerializer


class UserMembershipViewSet(ModelViewSet):
    queryset = UserMembership.objects.all()
    serializer_class = UserMembershipSerializer