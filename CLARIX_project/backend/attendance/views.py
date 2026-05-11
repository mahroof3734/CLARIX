from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.db.models import Count, Q
from .models import AttendanceSession, AttendanceRecord
from .serializers import AttendanceSessionSerializer, AttendanceRecordSerializer
from users.models import ClassRoom

class AttendanceSessionListCreateView(generics.ListCreateAPIView):
    serializer_class = AttendanceSessionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        classroom_id = self.request.query_params.get('classroom')
        qs = AttendanceSession.objects.all()
        if classroom_id:
            qs = qs.filter(classroom_id=classroom_id)
        return qs.prefetch_related('records__student')

    def perform_create(self, serializer):
        session = serializer.save(created_by=self.request.user)
        classroom = session.classroom
        for student in classroom.students.all():
            AttendanceRecord.objects.get_or_create(session=session, student=student)

class AttendanceSessionDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AttendanceSessionSerializer
    permission_classes = [IsAuthenticated]
    queryset = AttendanceSession.objects.all()

class MarkAttendanceView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, session_id):
        session = AttendanceSession.objects.get(id=session_id)
        records_data = request.data.get('records', [])
        for record_data in records_data:
            AttendanceRecord.objects.update_or_create(
                session=session, student_id=record_data['student'],
                defaults={'status': record_data['status'], 'remarks': record_data.get('remarks', '')}
            )
        return Response({'status': 'Attendance marked successfully'})

class StudentAttendanceView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, classroom_id):
        student = request.user
        sessions = AttendanceSession.objects.filter(classroom_id=classroom_id)
        total = sessions.count()
        present = AttendanceRecord.objects.filter(session__classroom_id=classroom_id, student=student, status='present').count()
        absent = AttendanceRecord.objects.filter(session__classroom_id=classroom_id, student=student, status='absent').count()
        percentage = round((present / total * 100), 1) if total > 0 else 0
        records = AttendanceRecord.objects.filter(session__classroom_id=classroom_id, student=student).select_related('session')
        data = [{
            'date': r.session.date,
            'topic': r.session.topic,
            'status': r.status,
        } for r in records]
        return Response({'total': total, 'present': present, 'absent': absent, 'percentage': percentage, 'records': data})
