from django.contrib import admin
from .models import AttendanceSession, AttendanceRecord
@admin.register(AttendanceSession)
class SessionAdmin(admin.ModelAdmin):
    list_display = ['classroom', 'date', 'topic', 'created_by']
@admin.register(AttendanceRecord)
class RecordAdmin(admin.ModelAdmin):
    list_display = ['session', 'student', 'status']
