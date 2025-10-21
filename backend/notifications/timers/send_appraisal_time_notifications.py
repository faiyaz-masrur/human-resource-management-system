from django.core.management.base import BaseCommand
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from appraisals.models import EmployeeAppraisalTimer, EmployeeAppraisal
from system.models import Employee
from notifications.models import Notification


class Command(BaseCommand):
    help = 'Send appraisal notifications on the 1st, 15th, or 30th day of each month.'

    def handle(self, *args, **kwargs):
        today = timezone.now().date()
        day = today.day

        # Check if today is 1st, 15th, or 30th
        if day not in [1, 15, 30]:
            self.stdout.write(self.style.NOTICE(f"No notifications to send today ({today})."))
            return

        self.stdout.write(self.style.NOTICE(f"Running appraisal notification check for {today}..."))

        if day == 1:
            self.send_start_notifications(today)
        elif day == 15:
            self.send_reminder_notifications()
        elif day == 30:
            self.send_deadline_notifications()

        self.stdout.write(self.style.SUCCESS("Appraisal notification process completed."))

    # ------------------------------------------------------------------------
    # 1st day → Start Notifications
    # ------------------------------------------------------------------------
    def send_start_notifications(self, today):
        timers = EmployeeAppraisalTimer.objects.filter(employee_self_appraisal_start=today)

        if not timers.exists():
            self.stdout.write(self.style.WARNING("No appraisal timers start today."))
            return

        for timer in timers:
            employee = timer.employee_id
            if not employee:
                continue

            Notification.objects.create(
                employee=employee,
                title="Appraisal Period Started",
                message=f"Your appraisal period has started today and will end on {timer.employee_self_appraisal_end}. Please complete your self-appraisal before the end date."
            )

            if employee.email:
                send_mail(
                    "Appraisal Period Started",
                    f"Dear {employee.name},\n\nYour appraisal period has started today ({today}) and will end on {timer.employee_self_appraisal_end}.\nPlease complete your appraisal before the end date.",
                    settings.DEFAULT_FROM_EMAIL,
                    [employee.email],
                    fail_silently=True,
                )

            self.stdout.write(self.style.SUCCESS(f"Sent start notification to {employee.email}"))

    # ------------------------------------------------------------------------
    # 15th day → Reminder Notifications
    # ------------------------------------------------------------------------
    def send_reminder_notifications(self):
        all_timers = EmployeeAppraisalTimer.objects.all()

        for timer in all_timers:
            employee = timer.employee_id
            if not employee:
                continue

            # Check if appraisal exists for this employee
            appraisal_exists = EmployeeAppraisal.objects.filter(employee=employee).exists()
            if appraisal_exists:
                continue  # Skip if already submitted

            Notification.objects.create(
                employee=employee,
                title="Reminder: Submit Your Appraisal",
                message=f"This is a reminder to submit your self-appraisal before {timer.employee_self_appraisal_end}.",
            )

            if employee.email:
                send_mail(
                    "Reminder: Submit Your Appraisal",
                    f"Dear {employee.name},\n\nThis is a reminder to complete your self-appraisal before {timer.employee_self_appraisal_end}.",
                    settings.DEFAULT_FROM_EMAIL,
                    [employee.email],
                    fail_silently=True,
                )

            self.stdout.write(self.style.SUCCESS(f"Sent reminder notification to {employee.email}"))

    # ------------------------------------------------------------------------
    # 30th day → Deadline Notifications
    # ------------------------------------------------------------------------
    def send_deadline_notifications(self):
        all_timers = EmployeeAppraisalTimer.objects.all()

        for timer in all_timers:
            employee = timer.employee_id
            if not employee:
                continue

            # Still no appraisal submitted?
            appraisal_exists = EmployeeAppraisal.objects.filter(employee=employee).exists()
            if appraisal_exists:
                continue

            Notification.objects.create(
                employee=employee,
                title="Final Reminder: Appraisal Submission Deadline",
                message="Today is the last day to submit your self-appraisal. Please ensure it is completed by end of day.",
            )

            if employee.email:
                send_mail(
                    "Final Reminder: Appraisal Deadline",
                    f"Dear {employee.name},\n\nToday is the last day to submit your self-appraisal. Please ensure it is completed by the end of the day.",
                    settings.DEFAULT_FROM_EMAIL,
                    [employee.email],
                    fail_silently=True,
                )

            self.stdout.write(self.style.SUCCESS(f"Sent deadline notification to {employee.email}"))
