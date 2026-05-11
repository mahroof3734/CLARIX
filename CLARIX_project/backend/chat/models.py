from django.db import models
from users.models import User, ClassRoom

class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages', null=True, blank=True)
    classroom = models.ForeignKey(ClassRoom, on_delete=models.CASCADE, related_name='messages', null=True, blank=True)
    content = models.TextField()
    file = models.FileField(upload_to='chat_files/', blank=True, null=True)
    is_read = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return f"{self.sender} -> {self.receiver or self.classroom}: {self.content[:30]}"
