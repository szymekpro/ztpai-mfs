from rest_framework import serializers
from .models import Payment
from users.serializers import UsersSerializer
from users.models import CustomUser


class PaymentsSerializer(serializers.ModelSerializer):
    user = UsersSerializer(read_only=True)
    class Meta:
        model = Payment
        fields = [
            'id',
            'user',
            'amount',
            'status',
            'created_at',
            'description',
            'content_type',
            'object_id',
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

class PaymentCreateSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all())

    class Meta:
        model = Payment
        fields = [
            "id", "user", "amount", "status", "created_at",
            "description", "content_type", "object_id"
        ]
        read_only_fields = ["id", "created_at"]
