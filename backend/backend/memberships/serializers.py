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

    def validate_photo_path(self, value):
        if value and not value.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
            raise serializers.ValidationError("Photo path must end with .jpg, .jpeg, .png or .webp")
        return value

class UserMembershipSerializer(serializers.ModelSerializer):

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
        read_only_fields = [
            'id',
        ]

    def validate_photo_path(self, value):
        if value and not value.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
            raise serializers.ValidationError("Photo path must end with .jpg, .jpeg, .png or .webp")
        return value

