from rest_framework import serializers
from .models import AttendanceSession, AttendanceRecord
from users.serializers import UserSerializer

class AttendanceRecordSerializer(serializers.ModelSerializer):
    student_detail = UserSerializer(source='student', read_only=True)
    class Meta:
        model = AttendanceRecord
        fields = ['id', 'student', 'student_detail', 'status', 'remarks']

class AttendanceSessionSerializer(serializers.ModelSerializer):
    records = AttendanceRecordSerializer(many=True, read_only=True)
    present_count = serializers.SerializerMethodField()
    absent_count = serializers.SerializerMethodField()

    class Meta:
        model = AttendanceSession
        fields = ['id', 'classroom', 'date', 'topic', 'created_by', 'created_at', 'records', 'present_count', 'absent_count']
        read_only_fields = ['created_by']

    def get_present_count(self, obj):
        return obj.records.filter(status='present').count()

    def get_absent_count(self, obj):
        return obj.records.filter(status='absent').count()
