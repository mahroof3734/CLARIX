from django.urls import path
from .views import AttendanceSessionListCreateView, AttendanceSessionDetailView, MarkAttendanceView, StudentAttendanceView

urlpatterns = [
    path('sessions/', AttendanceSessionListCreateView.as_view()),
    path('sessions/<int:pk>/', AttendanceSessionDetailView.as_view()),
    path('sessions/<int:session_id>/mark/', MarkAttendanceView.as_view()),
    path('student/<int:classroom_id>/', StudentAttendanceView.as_view()),
]
