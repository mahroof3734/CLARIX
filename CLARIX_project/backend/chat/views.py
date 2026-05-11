from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.db.models import Q, Count
from .models import Message
from .serializers import MessageSerializer
from users.models import User

class DirectMessageListView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        other_id = self.kwargs['user_id']
        # Mark messages as read when fetching
        Message.objects.filter(
            sender_id=other_id, receiver=self.request.user, is_read=False
        ).update(is_read=True)
        return Message.objects.filter(
            Q(sender=self.request.user, receiver_id=other_id) |
            Q(sender_id=other_id, receiver=self.request.user),
            classroom__isnull=True
        ).select_related('sender')

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user, receiver_id=self.kwargs['user_id'])

class ClassroomMessageListView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Message.objects.filter(
            classroom_id=self.kwargs['classroom_id']
        ).select_related('sender')

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user, classroom_id=self.kwargs['classroom_id'])

class UnreadCountView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        count = Message.objects.filter(receiver=request.user, is_read=False).count()
        return Response({'unread': count})

class MarkReadView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, user_id):
        Message.objects.filter(
            sender_id=user_id, receiver=request.user, is_read=False
        ).update(is_read=True)
        return Response({'status': 'marked read'})
