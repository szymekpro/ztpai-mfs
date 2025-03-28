import re
from rest_framework import serializers
from .models import Gym, Trainer, TrainerAvailability

class GymSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gym
        fields = [
            'id',
            'name',
            'city',
            'address',
            'description',
            'photo_path',
        ]
        read_only_fields = [
            'id'
        ]

    def validate_address(self, data):
        address = data.get('address', '')
        if not any(char.isdigit() for char in address):
            raise serializers.ValidationError({
                'address': 'Address must contain a street number.'
            })
        return data

    def validate_photo_path(self, value):
        if value and not value.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
            raise serializers.ValidationError("Photo path must end with .jpg, .jpeg, .png or .webp")
        return value

class TrainerSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()  # ← pochodzi z @property

    class Meta:
        model = Trainer
        fields = [
            'id',
            'first_name',
            'last_name',
            'gym',
            'bio',
            'photo_path',
            'full_name',
        ]
        read_only_fields = [
            'id',
            'full_name'
        ]

    def validate_photo_path(self, value):
        if value and not value.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
            raise serializers.ValidationError("Photo path must end with .jpg, .jpeg, .png or .webp")
        return value

class TrainerAvailabilitySerializer(serializers.ModelSerializer):

    class Meta:
        model = TrainerAvailability
        fields = [
            'trainer',
            'weekday',
            'start_time',
            'end_time',
        ]
        read_only_fields = ['id']

    def validate(self, data):
        start = data.get('start_time')
        end = data.get('end_time')
        if start and end and start >= end:
            raise serializers.ValidationError("Start time must be before end time.")
        return data
