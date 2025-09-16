from django.core.management.base import BaseCommand
from appraisals.models import (
    EmployeeAppraisalTimer,
    ReportingManagerAppraisalTimer,
    FinalReviewerAppraisalTimer,
)
from datetime import date
import logging

# Set up logging for the command
logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Updates the start, end, and remind dates of all Appraisal Timers for the current year.'

    def handle(self, *args, **options):
        self.stdout.write("Starting yearly update for Employee, Manager & Final Reviewer Appraisal Timers...")

        today = date.today()

        # ---------------- Employee Appraisal Timer ----------------
        try:
            employee_timer, _ = EmployeeAppraisalTimer.objects.get_or_create()

            if employee_timer.employee_self_appraisal_start and employee_timer.employee_self_appraisal_end and employee_timer.employee_self_appraisal_remind:
                old_start = employee_timer.employee_self_appraisal_start
                old_end = employee_timer.employee_self_appraisal_end
                old_remind = employee_timer.employee_self_appraisal_remind

                employee_timer.employee_self_appraisal_start = date(today.year, old_start.month, old_start.day)
                employee_timer.employee_self_appraisal_end = date(today.year, old_end.month, old_end.day)
                employee_timer.employee_self_appraisal_remind = date(today.year, old_remind.month, old_remind.day)

                employee_timer.save()

                self.stdout.write(self.style.SUCCESS(
                    f"Employee Appraisal Timer updated: "
                    f"{employee_timer.employee_self_appraisal_start} to {employee_timer.employee_self_appraisal_end}, "
                    f"Reminder: {employee_timer.employee_self_appraisal_remind}"
                ))
            else:
                self.stdout.write(self.style.WARNING("⚠ Employee Appraisal Timer has incomplete dates."))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error updating Employee Appraisal Timer: {e}"))
            logger.error(f"Error updating Employee Appraisal Timer: {e}", exc_info=True)

        # ---------------- Reporting Manager Appraisal Timer ----------------
        try:
            manager_timer, _ = ReportingManagerAppraisalTimer.objects.get_or_create()

            if manager_timer.reporting_manager_review_start and manager_timer.reporting_manager_review_end and manager_timer.reporting_manager_review_remind:
                old_start = manager_timer.reporting_manager_review_start
                old_end = manager_timer.reporting_manager_review_end
                old_remind = manager_timer.reporting_manager_review_remind

                manager_timer.reporting_manager_review_start = date(today.year, old_start.month, old_start.day)
                manager_timer.reporting_manager_review_end = date(today.year, old_end.month, old_end.day)
                manager_timer.reporting_manager_review_remind = date(today.year, old_remind.month, old_remind.day)

                manager_timer.save()

                self.stdout.write(self.style.SUCCESS(
                    f"Reporting Manager Timer updated: "
                    f"{manager_timer.reporting_manager_review_start} to {manager_timer.reporting_manager_review_end}, "
                    f"Reminder: {manager_timer.reporting_manager_review_remind}"
                ))
            else:
                self.stdout.write(self.style.WARNING("⚠ Reporting Manager Timer has incomplete dates."))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error updating Reporting Manager Appraisal Timer: {e}"))
            logger.error(f"Error updating Reporting Manager Appraisal Timer: {e}", exc_info=True)

        # ---------------- Final Reviewer Appraisal Timer ----------------
        try:
            reviewer_timer, _ = FinalReviewerAppraisalTimer.objects.get_or_create()

            if reviewer_timer.final_review_start and reviewer_timer.final_review_end and reviewer_timer.final_review_remind:
                old_start = reviewer_timer.final_review_start
                old_end = reviewer_timer.final_review_end
                old_remind = reviewer_timer.final_review_remind

                reviewer_timer.final_review_start = date(today.year, old_start.month, old_start.day)
                reviewer_timer.final_review_end = date(today.year, old_end.month, old_end.day)
                reviewer_timer.final_review_remind = date(today.year, old_remind.month, old_remind.day)

                reviewer_timer.save()

                self.stdout.write(self.style.SUCCESS(
                    f"Final Reviewer Timer updated: "
                    f"{reviewer_timer.final_review_start} to {reviewer_timer.final_review_end}, "
                    f"Reminder: {reviewer_timer.final_review_remind}"
                ))
            else:
                self.stdout.write(self.style.WARNING("⚠ Final Reviewer Timer has incomplete dates."))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error updating Final Reviewer Appraisal Timer: {e}"))
            logger.error(f"Error updating Final Reviewer Appraisal Timer: {e}", exc_info=True)

        self.stdout.write(self.style.SUCCESS("Yearly update completed for all timers."))
