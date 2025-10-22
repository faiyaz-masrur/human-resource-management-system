from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.utils import timezone
from django.db import transaction
from .models import EmployeeAttendance, AttendanceEvent
from .serializers import (
    EmployeeAttendanceSerializer,
    AttendanceEventSerializer,
    AttendanceHistoryItemSerializer,
)
from rest_framework.views import APIView
from django.http import JsonResponse
from django.conf import settings

# ============================================================
# 🔑 Google Maps API Key Endpoint
# ============================================================
@api_view(['GET'])
def get_google_maps_api_key(request):
    key = getattr(settings, 'GOOGLE_MAPS_API_KEY', None)
    if not key:
        return JsonResponse({'detail': 'API key not configured'}, status=500)
    return JsonResponse({'key': key})

# ============================================================
# 🎯 Attendance Event ViewSet
# ============================================================
class AttendanceEventViewSet(viewsets.GenericViewSet):
    queryset = AttendanceEvent.objects.all()
    serializer_class = AttendanceEventSerializer
    permission_classes = [AllowAny]

    # ------------------------------
    # Log enter/exit event
    # ------------------------------
    @action(detail=False, methods=['post'])
    @transaction.atomic
    def log_event(self, request):
        serializer = AttendanceEventSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        ev = serializer.save()

        # Update or create EmployeeAttendance row
        ev_date = ev.timestamp.date()
        attendance, _ = EmployeeAttendance.objects.get_or_create(
            employee=ev.employee, date=ev_date
        )

        if ev.event_type == AttendanceEvent.EVENT_ENTER and not attendance.in_time:
            attendance.in_time = ev.timestamp
            attendance.save()

        if ev.event_type == AttendanceEvent.EVENT_EXIT and ev.is_final_exit:
            attendance.out_time = ev.timestamp
            attendance.save()

        # Recompute work/region durations
        self.recompute_attendance_from_events(attendance)

        return Response({"detail": "logged", "attendance_id": attendance.id}, status=201)

    # ------------------------------
    # Recompute derived fields
    # ------------------------------
    def recompute_attendance_from_events(self, attendance: EmployeeAttendance):
        start = timezone.make_aware(
            timezone.datetime.combine(attendance.date, timezone.datetime.min.time())
        )
        end = timezone.make_aware(
            timezone.datetime.combine(attendance.date, timezone.datetime.max.time())
        )

        events = AttendanceEvent.objects.filter(
            employee=attendance.employee,
            timestamp__gte=start,
            timestamp__lte=end
        ).order_by("timestamp")

        total_work = 0
        last_enter = None

        for ev in events:
            if ev.event_type == AttendanceEvent.EVENT_ENTER:
                last_enter = ev.timestamp
            elif ev.event_type == AttendanceEvent.EVENT_EXIT and last_enter:
                total_work += (ev.timestamp - last_enter).total_seconds()
                last_enter = None

        attendance.total_work_seconds = int(total_work)
        attendance.outside_region_seconds = int(total_work)  # adjust logic if needed
        attendance.save()

# ============================================================
# 📘 Attendance History API
# ============================================================
class AttendanceHistoryAPIView(APIView):
    def get(self, request, employee_id):
        month = int(request.query_params.get('month', timezone.now().month))
        year = int(request.query_params.get('year', timezone.now().year))
        records = EmployeeAttendance.objects.filter(
            employee_id=employee_id, date__month=month, date__year=year
        ).order_by("date")
        serializer = AttendanceHistoryItemSerializer(records, many=True)
        return Response(serializer.data)

# ============================================================
# 🛠️ Attendance Reconciliation API
# ============================================================
class AttendanceReconciliationAPIView(APIView):
    def post(self, request):
        attendance_id = request.data.get("attendance_id")
        new_out_time = request.data.get("new_out_time")
        remarks = request.data.get("remarks", "")

        try:
            attendance = EmployeeAttendance.objects.get(id=attendance_id)
        except EmployeeAttendance.DoesNotExist:
            return Response({"detail": "Attendance not found"}, status=404)

        attendance.out_time = new_out_time
        attendance.remarks = remarks
        attendance.save()
        return Response({"detail": "Reconciled successfully"}, status=200)

# ... (imports)
from django.utils import timezone
from .models import EmployeeAttendance, AttendanceEvent
from system.models import Employee
from .serializers import (
    EmployeeAttendanceSerializer,
    AttendanceEventSerializer,
    AttendanceHistoryItemSerializer, 
)
from rest_framework.views import APIView


# ============================================================
# 🎯 Attendance Event ViewSet
# ============================================================
class AttendanceEventViewSet(viewsets.GenericViewSet):
    # ... (queryset, serializer_class, etc. remain the same)

    # ------------------------------
    # Log enter/exit event
    # ------------------------------
    @action(detail=False, methods=['post'])
    @transaction.atomic
    def log_event(self, request):
        serializer = AttendanceEventSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        ev = serializer.save()

        # Update or create EmployeeAttendance row
        ev_date = ev.timestamp.date()
        attendance, _ = EmployeeAttendance.objects.get_or_create(
            employee=ev.employee, date=ev_date
        )

        if ev.event_type == AttendanceEvent.EVENT_ENTER and not attendance.in_time:
            attendance.in_time = ev.timestamp
            attendance.save()

        if ev.event_type == AttendanceEvent.EVENT_EXIT and ev.is_final_exit:
            attendance.out_time = ev.timestamp
            attendance.save()

        # Recompute work/region durations
        self.recompute_attendance_from_events(attendance)
        
        # --- MODIFICATION ---
        # Serialize and return the updated attendance record
        # Use the history serializer as it has all the computed fields
        response_serializer = AttendanceHistoryItemSerializer(attendance)
        return Response(response_serializer.data, status=201)
        # --- END MODIFICATION ---

    # ------------------------------
    # Recompute derived fields
    # ------------------------------
    def recompute_attendance_from_events(self, attendance: EmployeeAttendance):
        # ... (this function remains unchanged)
        start = timezone.make_aware(
            timezone.datetime.combine(attendance.date, timezone.datetime.min.time())
        )
        end = timezone.make_aware(
            timezone.datetime.combine(attendance.date, timezone.datetime.max.time())
        )

        events = AttendanceEvent.objects.filter(
            employee=attendance.employee,
            timestamp__gte=start,
            timestamp__lte=end
        ).order_by("timestamp")

        total_work = 0
        last_enter = None

        for ev in events:
            if ev.event_type == AttendanceEvent.EVENT_ENTER:
                last_enter = ev.timestamp
            elif ev.event_type == AttendanceEvent.EVENT_EXIT and last_enter:
                total_work += (ev.timestamp - last_enter).total_seconds()
                last_enter = None

        attendance.total_work_seconds = int(total_work)
        attendance.outside_region_seconds = int(total_work)  # adjust logic if needed
        attendance.save()


# ============================================================
# ☀️ Today's Attendance API (NEW VIEW)
# ============================================================
class TodayAttendanceAPIView(APIView):
    """
    Fetches the attendance record for the logged-in user for the current date.
    """
    def get(self, request):
        today = timezone.now().date()
        
        # Get employee_id from query params, fallback to request.user if not provided
        employee_id = request.query_params.get('employee_id')
        employee = None

        if employee_id:
            try:
                employee = Employee.objects.get(id=employee_id)
            except Employee.DoesNotExist:
                return Response({"detail": "Employee not found."}, status=404)
        else:
            # Fallback to the authenticated user
            if not request.user.is_authenticated:
                 return Response({"detail": "Authentication required."}, status=401)
            employee = request.user

        if not employee:
            return Response({"detail": "Could not determine employee."}, status=400)

        # Get or create the record for today
        attendance, created = EmployeeAttendance.objects.get_or_create(
            employee=employee,
            date=today
        )
        
        serializer = AttendanceHistoryItemSerializer(attendance)
        return Response(serializer.data)

