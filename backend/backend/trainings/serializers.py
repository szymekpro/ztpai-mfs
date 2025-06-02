from datetime import timedelta

from rest_framework import serializers
from .models import ScheduledTraining
from gyms.serializers import TrainerServiceSerializer, TrainerSerializer
from gyms.models import TrainerService, Trainer
from django.utils.timezone import now


class ScheduledTrainingSerializer(serializers.ModelSerializer):
    service_type = TrainerServiceSerializer(read_only=True)
    service_type_id = serializers.PrimaryKeyRelatedField(
        queryset=TrainerService.objects.all(), source='service_type', write_only=True
    )

    trainer = TrainerSerializer(read_only=True)
    trainer_id = serializers.PrimaryKeyRelatedField(
        queryset=Trainer.objects.all(), source='trainer', write_only=True
    )

    class Meta:
        model = ScheduledTraining
        fields = [
            'id',
            'user',
            'trainer',
            'trainer_id',
            'gym',
            'service_type',
            'service_type_id',
            'start_time',
            'end_time',
            'status',
            'description'
        ]
        read_only_fields = ['id', 'user']

    def validate(self, data):
        start = data.get("start_time")
        end = data.get("end_time")
        trainer = data.get("trainer")

        if start and end and end <= start:
            raise serializers.ValidationError({
                "end_time": "End time must be after start time."
            })

        if start and start < now():
            raise serializers.ValidationError({
                "start_time": "Start time must be in the future."
            })

        if start and start > now() + timedelta(days=60):
            raise serializers.ValidationError({
                "start_time": "You can only book up to 60 days in advance."
            })


        return data

    def to_representation(self, instance):
        if instance.status == 'scheduled' and instance.end_time < now():
            instance.status = 'completed'
            instance.save(update_fields=['status'])

        data = super().to_representation(instance)
        return data
