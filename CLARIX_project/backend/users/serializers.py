from rest_framework import serializers
from .models import User, ClassRoom

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'student_id', 'department', 'avatar', 'is_online']
        read_only_fields = ['id', 'is_online']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 'role', 'student_id', 'department']

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

class ClassRoomSerializer(serializers.ModelSerializer):
    teacher_name = serializers.SerializerMethodField()
    student_count = serializers.SerializerMethodField()
    students = UserSerializer(many=True, read_only=True)

    class Meta:
        model = ClassRoom
        fields = ['id', 'name', 'subject', 'teacher', 'teacher_name', 'students', 'student_count', 'class_code', 'created_at']
        read_only_fields = ['teacher', 'class_code']

    def get_teacher_name(self, obj):
        return obj.teacher.get_full_name()

    def get_student_count(self, obj):
        return obj.students.count()
