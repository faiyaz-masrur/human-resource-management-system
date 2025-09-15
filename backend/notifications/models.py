from django.db import models
from django.utils import timezone
from employees.models import Employee

class Notification(models.Model):
    employee = models.ForeignKey(
        Employee,
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['-created_at']  

    def __str__(self):
        return f"Notification for {self.employee.employee_name}: {self.message[:30]}..."
