from django.urls import path
from .views import (
    NotificationListView, 
    NotificationUnreadCountView, 
    NotificationMarkReadView
)

urlpatterns = [
    # GET: List all notifications for the employee
    path('', NotificationListView.as_view(), name='notification-list'),
    
    # GET: Get the count of unread notifications
    path('unread-count/', NotificationUnreadCountView.as_view(), name='notification-unread-count'),

    # POST: Mark a specific notification as read (using PK)
    path('mark-read/<int:pk>/', NotificationMarkReadView.as_view(), name='notification-mark-single-read'),

    # POST: Mark ALL unread notifications as read (no PK needed)
    path('mark-all-read/', NotificationMarkReadView.as_view(), name='notification-mark-all-read'),
]
