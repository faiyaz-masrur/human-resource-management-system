# notifications/views.py
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from .models import Notification
from .serializers import NotificationSerializer

class NotificationListView(ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Fetch notifications only for the logged-in employee
        return Notification.objects.filter(employee=self.request.user).order_by('-created_at')
