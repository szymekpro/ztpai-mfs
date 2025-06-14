from rest_framework import serializers
from .models import Gym, Trainer, TrainerService


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
    available_services = serializers.PrimaryKeyRelatedField(many=True, queryset=TrainerService.objects.all())

    class Meta:
        model = Trainer
        fields = [
            'id',
            'first_name',
            'last_name',
            'gym',
            'bio',
            'description',
            'photo',
            'full_name',
            'available_services',
        ]
        read_only_fields = [
            'id',
            'full_name',
        ]

    def create(self, validated_data):
        validated_data.pop('id', None)
        services = validated_data.pop('available_services', [])
        trainer = Trainer.objects.create(**validated_data)
        trainer.available_services.set(services)
        return trainer

    def update(self, instance, validated_data):
        services = validated_data.pop('available_services', None)
        instance = super().update(instance, validated_data)

        if services is not None:
            instance.available_services.set(services)

        return instance

