from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.http import FileResponse
from .models import Note
from .serializers import NoteSerializer

class NoteListCreateView(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        classroom_id = self.request.query_params.get('classroom')
        qs = Note.objects.all()
        if classroom_id:
            qs = qs.filter(classroom_id=classroom_id)
        return qs.select_related('uploaded_by')

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)

class NoteDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]
    queryset = Note.objects.all()

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.download_count += 1
        instance.save()
        return super().retrieve(request, *args, **kwargs)
