from django.core.management.base import BaseCommand
from appraisals.models import EmployeeAppraisalTimer, ReportingManagerAppraisalTimer
from datetime import date, timedelta
import logging

# Set up logging for the command
logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = 'Updates the start, end, and remind dates of the Employee and Manager Appraisal Timers for the current year.'

    def handle(self, *args, **options):
        self.stdout.write("Starting yearly update for Employee & Manager Appraisal Timers...")

        today = date.today()

        # ---------------- Employee Appraisal Timer ----------------
        try:
            employee_timer, created = EmployeeAppraisalTimer.objects.get_or_create()

            if employee_timer.employee_appraisal_start and employee_timer.employee_appraisal_end:
                old_start = employee_timer.employee_appraisal_start
                old_end = employee_timer.employee_appraisal_end

                employee_timer.employee_appraisal_start = date(today.year, old_start.month, old_start.day)
                employee_timer.employee_appraisal_end = date(today.year, old_end.month, old_end.day)
                employee_timer.employee_appraisal_remind = employee_timer.employee_appraisal_end - timedelta(days=7)

                employee_timer.save()

                self.stdout.write(self.style.SUCCESS(
                    f"✅ Employee Appraisal Timer updated: "
                    f"{employee_timer.employee_appraisal_start} to {employee_timer.employee_appraisal_end}, "
                    f"Reminder: {employee_timer.employee_appraisal_remind}"
                ))
            else:
                self.stdout.write(self.style.WARNING("⚠ Employee Appraisal Timer has no start/end date set."))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"❌ Error updating Employee Appraisal Timer: {e}"))
            logger.error(f"Error updating Employee Appraisal Timer: {e}", exc_info=True)

        # ---------------- Reporting Manager Appraisal Timer ----------------
        try:
            manager_timer, created = ReportingManagerAppraisalTimer.objects.get_or_create()

            if manager_timer.review_period_start and manager_timer.review_period_end:
                old_start = manager_timer.review_period_start
                old_end = manager_timer.review_period_end

                manager_timer.review_period_start = date(today.year, old_start.month, old_start.day)
                manager_timer.review_period_end = date(today.year, old_end.month, old_end.day)
                manager_timer.review_period_remind = manager_timer.review_period_end - timedelta(days=7)

                manager_timer.save()

                self.stdout.write(self.style.SUCCESS(
                    f"✅ Reporting Manager Timer updated: "
                    f"{manager_timer.review_period_start} to {manager_timer.review_period_end}, "
                    f"Reminder: {manager_timer.review_period_remind}"
                ))
            else:
                self.stdout.write(self.style.WARNING("⚠ Reporting Manager Timer has no start/end date set."))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"❌ Error updating Reporting Manager Appraisal Timer: {e}"))
            logger.error(f"Error updating Reporting Manager Appraisal Timer: {e}", exc_info=True)

        self.stdout.write(self.style.SUCCESS("🎯 Yearly update completed for both timers."))
