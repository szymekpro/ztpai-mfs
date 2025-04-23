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
            'photo',
        ]
        read_only_fields = [
            'id'
        ]


class UserMembershipSerializer(serializers.ModelSerializer):
    membership_type = MembershipTypeSerializer(read_only=True)
    membership_type_id = serializers.PrimaryKeyRelatedField(
        source='membership_type',
        queryset=MembershipType.objects.all(),
        write_only=True
    )

    class Meta:
        model = UserMembership
        fields = [
            'id',
            'user',
            'membership_type',
            'membership_type_id',
            'start_date',
            'end_date',
            'is_active'
        ]
        read_only_fields = ['id', 'user']




