from django.utils import timezone
from datetime import timedelta, datetime

from rest_framework import serializers
from .models import MembershipType, UserMembership
from django.utils.timezone import now

from users.serializers import UsersSerializer


class MembershipTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = MembershipType
        fields = [
            'id',
            'name',
            'duration_days',
            'price',
            'description',
            'features_description',
            'photo',
        ]
        read_only_fields = [
            'id'
        ]


class UserMembershipSerializer(serializers.ModelSerializer):
    user = UsersSerializer(read_only=True)
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

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        end_date_str = rep.get('end_date')
        today = timezone.now().date()

        if end_date_str:
            end_date = datetime.strptime(end_date_str, "%Y-%m-%d").date()
            rep['expired'] = end_date < today
        else:
            rep['expired'] = None

        return rep



