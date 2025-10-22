from django.db import models
from django.utils import timezone
from system.models import Employee

class EmployeeAttendance(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='attendances')
    date = models.DateField()
    in_time = models.DateTimeField(null=True, blank=True)
    out_time = models.DateTimeField(null=True, blank=True)
    outside_region_seconds = models.IntegerField(default=0)
    total_work_seconds = models.IntegerField(default=0)
    remarks = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = (('employee', 'date'),)
        ordering = ['-date']

    def __str__(self):
        return f"{self.employee} - {self.date}"


class AttendanceEvent(models.Model):
    EVENT_ENTER = 'enter'
    EVENT_EXIT = 'exit'
    EVENT_CHOICES = [(EVENT_ENTER, 'Enter'), (EVENT_EXIT, 'Exit')]

    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='attendance_events')
    timestamp = models.DateTimeField(default=timezone.now)
    event_type = models.CharField(max_length=10, choices=EVENT_CHOICES)
    geofence_id = models.IntegerField(null=True, blank=True)
    is_final_exit = models.BooleanField(default=False)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.employee} {self.event_type} @ {self.timestamp}"
