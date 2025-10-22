from rest_framework import serializers
from .models import EmployeeAttendance, AttendanceEvent
import datetime

# ============================================================
# 🎯 Attendance Event Serializer
# ============================================================
class AttendanceEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttendanceEvent
        fields = [
            'id', 'employee', 'timestamp', 'event_type',
            'is_final_exit',
        ]
        read_only_fields = ['id', 'timestamp']

    def create(self, validated_data):
        from django.utils import timezone
        if 'timestamp' not in validated_data:
            validated_data['timestamp'] = timezone.now()
        return super().create(validated_data)


# ============================================================
# 🕒 Employee Attendance Serializer
# ============================================================
class EmployeeAttendanceSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.full_name', read_only=True)
    designation = serializers.CharField(source='employee.designation', read_only=True, default="")

    class Meta:
        model = EmployeeAttendance
        fields = [
            'id', 'employee', 'employee_name', 'designation',
            'date', 'in_time', 'out_time',
            'outside_region_seconds', 'total_work_seconds',
            'remarks',
        ]
        read_only_fields = ['outside_region_seconds', 'total_work_seconds']


# ============================================================
# 📘 Attendance History Serializer
# ============================================================
class AttendanceHistoryItemSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.full_name', read_only=True)
    in_time_label = serializers.SerializerMethodField()
    out_time_label = serializers.SerializerMethodField()
    total_work_hours = serializers.SerializerMethodField()
    outside_hours = serializers.SerializerMethodField()

    class Meta:
        model = EmployeeAttendance
        fields = [
            'id', 'date', 'employee', 'employee_name',
            'in_time', 'in_time_label', 'out_time', 'out_time_label',
            'outside_region_seconds', 'total_work_seconds',
            'total_work_hours', 'outside_hours', 'remarks',
        ]

    # ------------------------------
    # 🕓 Label logic for in/out time
    # ------------------------------
    def get_in_time_label(self, obj):
        if not obj.in_time:
            return 'absent'
        t = obj.in_time.time()
        if t <= datetime.time(9, 30):
            return 'early in'
        elif datetime.time(9, 30) < t <= datetime.time(10, 0):
            return 'in'
        elif datetime.time(10, 1) <= t <= datetime.time(10, 29):
            return 'delay'
        elif t >= datetime.time(10, 30):
            return 'extreme delay'
        return ''

    def get_out_time_label(self, obj):
        if not obj.out_time:
            return ''
        t = obj.out_time.time()
        if t < datetime.time(17, 30):
            return 'early leave'
        elif datetime.time(17, 30) <= t <= datetime.time(18, 30):
            return 'out time'
        elif t > datetime.time(18, 30):
            return 'late departure'
        return ''

    # ------------------------------
    # 🧮 Duration formatting helpers
    # ------------------------------
    def get_total_work_hours(self, obj):
        if obj.total_work_seconds:
            hours = int(obj.total_work_seconds // 3600)
            minutes = int((obj.total_work_seconds % 3600) // 60)
            return f"{hours:02d}:{minutes:02d}"
        return "00:00"

    def get_outside_hours(self, obj):
        if obj.outside_region_seconds:
            hours = int(obj.outside_region_seconds // 3600)
            minutes = int((obj.outside_region_seconds % 3600) // 60)
            return f"{hours:02d}:{minutes:02d}"
        return "00:00"


# ============================================================
# 🌐 All Employees Attendance Serializer (NEW)
# ============================================================
class AllEmployeesAttendanceSerializer(serializers.ModelSerializer):
    employee_id = serializers.IntegerField(source='employee.id')
    name = serializers.CharField(source='employee.full_name')
    total_work_hours = serializers.SerializerMethodField()
    outside_hours = serializers.SerializerMethodField()

    class Meta:
        model = EmployeeAttendance
        fields = [
            'employee_id', 'name', 'in_time', 'out_time',
            'total_work_hours', 'outside_hours',
        ]

    def get_total_work_hours(self, obj):
        if obj.total_work_seconds:
            hours = int(obj.total_work_seconds // 3600)
            minutes = int((obj.total_work_seconds % 3600) // 60)
            return f"{hours:02d}:{minutes:02d}"
        return "00:00"

    def get_outside_hours(self, obj):
        if obj.outside_region_seconds:
            hours = int(obj.outside_region_seconds // 3600)
            minutes = int((obj.outside_region_seconds % 3600) // 60)
            return f"{hours:02d}:{minutes:02d}"
        return "00:00"


# ============================================================
# 🧾 Attendance Report Serializer (NEW)
# ============================================================
class AttendanceReportSerializer(serializers.Serializer):
    employee_id = serializers.IntegerField()
    name = serializers.CharField()
    total_work_hours = serializers.CharField()
    present_days = serializers.IntegerField()
    absent_days = serializers.IntegerField()
    label_counts = serializers.DictField(child=serializers.IntegerField())
