from rest_framework import serializers
from .models import Note

class NoteSerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.SerializerMethodField()
    file_name = serializers.SerializerMethodField()
    file_size = serializers.SerializerMethodField()

    class Meta:
        model = Note
        fields = ['id', 'title', 'description', 'file', 'file_name', 'file_size', 'classroom', 'uploaded_by', 'uploaded_by_name', 'tags', 'download_count', 'uploaded_at']
        read_only_fields = ['uploaded_by', 'download_count']

    def get_uploaded_by_name(self, obj):
        return obj.uploaded_by.get_full_name()

    def get_file_name(self, obj):
        return obj.file.name.split('/')[-1] if obj.file else ''

    def get_file_size(self, obj):
        try:
            return obj.file.size
        except:
            return 0
