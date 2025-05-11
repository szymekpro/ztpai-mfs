from rest_framework import serializers
from .models import ScheduledTraining

class ScheduledTrainingSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScheduledTraining
        fields = [
            'id',
            'user',
            'trainer',
            'gym',
            'service_type',
            'start_time',
            'end_time',
            'status',
            'description'
        ]
        read_only_fields = [
            'id',
            'user'
        ]



#TODO validate!