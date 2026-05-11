from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, ClassRoom

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ['username', 'email', 'first_name', 'last_name', 'role', 'department']
    list_filter = ['role']
    fieldsets = UserAdmin.fieldsets + (('Profile', {'fields': ('role', 'student_id', 'department', 'avatar')}),)

@admin.register(ClassRoom)
class ClassRoomAdmin(admin.ModelAdmin):
    list_display = ['name', 'subject', 'teacher', 'class_code']
    filter_horizontal = ['students']
