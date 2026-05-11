from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterView, LoginView, ProfileView, UserListView, ClassRoomViewSet

router = DefaultRouter()
router.register('classrooms', ClassRoomViewSet, basename='classroom')

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', LoginView.as_view()),
    path('profile/', ProfileView.as_view()),
    path('users/', UserListView.as_view()),
    path('', include(router.urls)),
]
