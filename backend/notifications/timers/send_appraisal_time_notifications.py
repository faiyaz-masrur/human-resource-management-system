from django.core.management.base import BaseCommand
from django.utils import timezone
from appraisals.models import (
    EmployeeAppraisalTimer,
    ReportingManagerAppraisalTimer,
    EmployeeAppraisalStatusTrack,
    ReportingManagerAppraisalTrack,
)
from notifications.models import Notification
from django.core.mail import send_mail
from django.conf import settings


class Command(BaseCommand):
    help = 'Send appraisal notifications based on start and reminder dates'

    def handle(self, *args, **kwargs):
        today = timezone.now().date()
        self.stdout.write(self.style.NOTICE(f"Checking appraisal notification triggers for {today}..."))

        # --- Employee appraisal start ---
        for timer in EmployeeAppraisalTimer.objects.filter(employee_self_appraisal_start=today):
            # NOTE: Assuming the field name in EmployeeAppraisalTimer is 'employee_self_appraisal_start'
            # based on previous context, rather than the 'self_appraisal_start' used in the original snippet.
            # Please verify the exact field name if this causes an error.
            
            for track in EmployeeAppraisalStatusTrack.objects.filter(
                appraisal__appraisal_timer=timer, status="not_started"
            ):
                Notification.objects.create(
                    employee=track.employee,
                    title="Appraisal Started",
                    message=f"Your appraisal period starts today and will end on {timer.employee_self_appraisal_end}.",
                )
                send_mail(
                    "Appraisal Started",
                    f"Your appraisal period starts today and will end on {timer.employee_self_appraisal_end}. "
                    f"Please submit your appraisal before the end date.",
                    settings.DEFAULT_FROM_EMAIL,
                    [track.employee.email]
                )
                self.stdout.write(f"Sent 'Appraisal Started' notification to {track.employee.email}")

        # --- Reporting manager review start (COMMENTED OUT) ---
        # for timer in ReportingManagerAppraisalTimer.objects.filter(reporting_manager_review_start=today):
        #     for track in ReportingManagerAppraisalTrack.objects.filter(
        #         appraisal_cycle=timer, status="not_started"
        #     ):
        #         manager = track.reporting_manager
        #         Notification.objects.create(
        #             employee=manager,
        #             title="Appraisal Review Period Started",
        #             message=f"You have appraisal reviews to complete starting today and ending on {timer.reporting_manager_review_end}.",
        #         )
        #         send_mail(
        #             "Appraisal Review Period Started",
        #             f"You have appraisal reviews to complete starting today and ending on {timer.reporting_manager_review_end}. "
        #             f"Please complete them before the end date.",
        #             settings.DEFAULT_FROM_EMAIL,
        #             [manager.email]
        #         )

        # --- Employee appraisal reminder (pending appraisals) ---
        for timer in EmployeeAppraisalTimer.objects.filter(employee_self_appraisal_remind=today):
            # NOTE: Assuming the field name is 'employee_self_appraisal_remind'
            for track in EmployeeAppraisalStatusTrack.objects.filter(
                appraisal__appraisal_timer=timer, status="not_started"
            ):
                Notification.objects.create(
                    employee=track.employee,
                    title="Reminder: Submit Appraisal",
                    message=f"Please submit your appraisal before {timer.employee_self_appraisal_end}.",
                )
                send_mail(
                    "Reminder: Submit Appraisal",
                    f"Please submit your appraisal before {timer.employee_self_appraisal_end}.",
                    settings.DEFAULT_FROM_EMAIL,
                    [track.employee.email]
                )
                self.stdout.write(f"Sent 'Reminder' notification to {track.employee.email}")

        # --- Reporting manager review reminder (pending reviews) (COMMENTED OUT) ---
        # for timer in ReportingManagerAppraisalTimer.objects.filter(reporting_manager_review_remind=today):
        #     for track in ReportingManagerAppraisalTrack.objects.filter(appraisal_cycle=timer).exclude(status="submitted"):
        #         manager = track.reporting_manager
        #         Notification.objects.create(
        #             employee=manager,
        #             title="Reminder: Complete Reviews",
        #             message=f"Please complete your appraisal reviews before {timer.reporting_manager_review_end}.",
        #         )
        #         send_mail(
        #             "Reminder: Complete Reviews",
        #             f"Please complete your appraisal reviews before {timer.reporting_manager_review_end}.",
        #             settings.DEFAULT_FROM_EMAIL,
        #             [manager.email]
        #         )

        self.stdout.write(self.style.SUCCESS('Appraisal notifications check completed.'))
