from rest_framework import serializers
from .models import Gym, Trainer, TrainerAvailability, TrainerService


class GymSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gym
        fields = [
            'id',
            'name',
            'city',
            'address',
            'description',
            'photo',
        ]
        read_only_fields = [
            'id'
        ]

    def validate_address(self, data):
        if not any(char.isdigit() for char in data):
            raise serializers.ValidationError({
                'address': 'Address must contain a street number.'
            })
        return data

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

class TrainerServiceSerializer(serializers.ModelSerializer):

    class Meta:
        model = TrainerService
        fields = [
            'id',
            'name',
            'description',
            'price'
        ]


class TrainerSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    availability = TrainerAvailabilitySerializer(many=True, read_only=True)

    class Meta:
        model = Trainer
        fields = [
            'id',
            'first_name',
            'last_name',
            'gym',
            'bio',
            'photo',
            'full_name',
            'availability',
        ]
        read_only_fields = [
            'id',
            'full_name',
        ]

