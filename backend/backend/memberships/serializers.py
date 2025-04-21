from rest_framework import serializers
from .models import MembershipType, UserMembership

class MembershipTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = MembershipType
        fields = [
            'id',
            'name',
            'duration_days',
            'price',
            'description',
            'photo_path',
        ]
        read_only_fields = [
            'id'
        ]


class UserMembershipSerializer(serializers.ModelSerializer):
    membership_type = serializers.PrimaryKeyRelatedField(
        queryset=MembershipType.objects.all()
    )

    class Meta:
        model = UserMembership
        fields = [
            'id',
            'user',
            'membership_type',
            'start_date',
            'end_date',
            'is_active',
        ]
        read_only_fields = ['id', 'user']



