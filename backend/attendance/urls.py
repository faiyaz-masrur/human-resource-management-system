from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AttendanceEventViewSet,
    AttendanceReconciliationAPIView,
    AttendanceHistoryAPIView,
    get_google_maps_api_key,
    TodayAttendanceAPIView,  # <-- IMPORT NEW VIEW
)

router = DefaultRouter()
router.register(r'events', AttendanceEventViewSet, basename='attendance-events')

urlpatterns = [
    path('', include(router.urls)),
    path('reconcile/', AttendanceReconciliationAPIView.as_view(), name='attendance-reconcile'),
    path('history/<int:employee_id>/', AttendanceHistoryAPIView.as_view(), name='attendance-history'),
    path('api-key/', get_google_maps_api_key, name='attendance-api-key'),
    path('attendance-today/', TodayAttendanceAPIView.as_view(), name='attendance-today'), # <-- ADD THIS
]