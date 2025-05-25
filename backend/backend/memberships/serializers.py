from rest_framework import serializers
from .models import MembershipType, UserMembership
from django.utils.timezone import now

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

    def validate(self, attrs):
        user = self.context['request'].user
        membership_type = attrs['membership_type']
        today = now().date()

        existing = UserMembership.objects.filter(
            user=user,
            membership_type=membership_type,
            is_active=True
        ).exists()

        if existing:
            raise serializers.ValidationError(
                "You already have an active membership of this type."
            )

        return attrs
    def to_representation(self, instance):
        today = now().date()

        if instance.end_date < today:
            instance.is_active = False
            instance.save(update_fields=['is_active'])

        return super().to_representation(instance)




