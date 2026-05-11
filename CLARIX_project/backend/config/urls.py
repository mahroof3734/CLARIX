from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/chat/', include('chat.urls')),
    path('api/attendance/', include('attendance.urls')),
    path('api/notes/', include('notes.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
