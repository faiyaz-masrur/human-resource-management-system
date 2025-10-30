from django.db import models
from django.utils import timezone
from system.models import Employee

# ============================================================
# Employee Attendance Model
# ============================================================
class EmployeeAttendance(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    date = models.DateField()
    in_time = models.DateTimeField(null=True, blank=True)
    out_time = models.DateTimeField(null=True, blank=True)
    total_work_time = models.IntegerField(default=0)
    outside_region_time = models.IntegerField(default=0)
    remarks = models.TextField(blank=True, null=True)

    class Meta:
        unique_together = ('employee', 'date')
        ordering = ['-date']

    def __str__(self):
        return f"{self.employee.name} - {self.date}"

    # ------------------------------
    # Convenience property for frontend
    # ------------------------------
    @property
    def total_work_hours(self):
        hours = self.total_work_seconds // 3600
        minutes = (self.total_work_seconds % 3600) // 60
        return f"{hours:02d}:{minutes:02d}"

    @property
    def outside_hours(self):
        hours = self.outside_region_seconds // 3600
        minutes = (self.outside_region_seconds % 3600) // 60
        return f"{hours:02d}:{minutes:02d}"


# ============================================================
# Attendance Event Model
# ============================================================
class AttendanceEvent(models.Model):
    EVENT_ENTER = "enter"
    EVENT_EXIT = "exit"

    EVENT_CHOICES = [
        (EVENT_ENTER, "Enter"),
        (EVENT_EXIT, "Exit"),
    ]

    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(default=timezone.now)
    event_type = models.CharField(max_length=10, choices=EVENT_CHOICES)
    is_final_exit = models.BooleanField(default=False)  # used for exit logging

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.employee.name} - {self.event_type} at {self.timestamp}"
