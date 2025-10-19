from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from django.shortcuts import get_object_or_404
from django.db.models import Count

from .models import Notification
from .serializers import NotificationSerializer

class NotificationListView(ListAPIView):
    """
    Retrieves all notifications for the authenticated employee.
    Requires the user to be authenticated and linked to an EmployeeProfile.
    """
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Ensure the user has an associated Employee profile
        if not hasattr(self.request.user, 'employee_profile'):
            return Notification.objects.none()

        # Fetch notifications only for the logged-in employee's profile
        return Notification.objects.filter(
            employee=self.request.user.employee_profile
        ).order_by('-created_at')

class NotificationUnreadCountView(APIView):
    """
    Returns the count of unread notifications for the authenticated employee.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        if not hasattr(request.user, 'employee_profile'):
            return Response({'unread_count': 0}, status=status.HTTP_200_OK)

        unread_count = Notification.objects.filter(
            employee=request.user.employee_profile,
            is_read=False
        ).count()
        
        return Response({'unread_count': unread_count}, status=status.HTTP_200_OK)


class NotificationMarkReadView(APIView):
    """
    Handles marking one or all notifications as read for the authenticated employee.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, pk=None, format=None):
        if not hasattr(request.user, 'employee_profile'):
            return Response(
                {'detail': 'User profile not found.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        employee_profile = request.user.employee_profile

        if pk is not None:
            # Mark a specific notification as read
            notification = get_object_or_404(Notification, pk=pk, employee=employee_profile)
            notification.is_read = True
            notification.save(update_fields=['is_read'])
            return Response({'detail': f'Notification {pk} marked as read.'}, status=status.HTTP_200_OK)
        else:
            # Mark all unread notifications as read
            unread_notifications = Notification.objects.filter(
                employee=employee_profile,
                is_read=False
            )
            count = unread_notifications.update(is_read=True)
            return Response({'detail': f'{count} notifications marked as read.'}, status=status.HTTP_200_OK)
