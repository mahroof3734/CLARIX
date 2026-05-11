from rest_framework import generics, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
import random, string
from .models import User, ClassRoom
from .serializers import UserSerializer, RegisterSerializer, ClassRoomSerializer

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)

class LoginView(generics.GenericAPIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

class UserListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        role = self.request.query_params.get('role')
        qs = User.objects.exclude(id=self.request.user.id)
        if role:
            qs = qs.filter(role=role)
        return qs

class ClassRoomViewSet(viewsets.ModelViewSet):
    serializer_class = ClassRoomSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'teacher':
            return ClassRoom.objects.filter(teacher=user)
        return user.enrolled_classes.all()

    def perform_create(self, serializer):
        code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
        serializer.save(teacher=self.request.user, class_code=code)

    @action(detail=False, methods=['post'])
    def join(self, request):
        code = request.data.get('class_code')
        try:
            classroom = ClassRoom.objects.get(class_code=code)
            classroom.students.add(request.user)
            return Response(ClassRoomSerializer(classroom).data)
        except ClassRoom.DoesNotExist:
            return Response({'error': 'Invalid class code'}, status=404)

    @action(detail=True, methods=['delete'])
    def remove_student(self, request, pk=None):
        classroom = self.get_object()
        student_id = request.data.get('student_id')
        classroom.students.remove(student_id)
        return Response({'status': 'removed'})
