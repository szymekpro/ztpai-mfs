from rest_framework import serializers
from .models import Payment

class PaymentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = [
            'id',
            'user',
            'amount',
            'status',
            'description',
        ]
        read_only_fields = [
            'id'
        ]


class PaymentUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ["status", "description"]
        extra_kwargs = {
            "status": {"required": False},
            "description": {"required": False},
        }