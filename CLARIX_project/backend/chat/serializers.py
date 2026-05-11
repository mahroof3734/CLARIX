from rest_framework import serializers
from .models import Message
from users.serializers import UserSerializer

class MessageSerializer(serializers.ModelSerializer):
    sender_detail = UserSerializer(source='sender', read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'sender', 'sender_detail', 'receiver', 'classroom', 'content', 'file', 'is_read', 'timestamp']
        read_only_fields = ['sender', 'timestamp']
