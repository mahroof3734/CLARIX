from django.urls import path
from .views import DirectMessageListView, ClassroomMessageListView, UnreadCountView, MarkReadView

urlpatterns = [
    path('direct/<int:user_id>/', DirectMessageListView.as_view()),
    path('classroom/<int:classroom_id>/', ClassroomMessageListView.as_view()),
    path('unread/', UnreadCountView.as_view()),
    path('read/<int:user_id>/', MarkReadView.as_view()),
]
