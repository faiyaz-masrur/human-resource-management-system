from django.core.management.base import BaseCommand
from appraisals.models import AppraisalTimer
from datetime import date, timedelta
import logging

# Set up logging for the command
logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Updates the start, end, and remind dates of the AppraisalTimer for the current year.'

    def handle(self, *args, **options):
        """
        This is the main logic of the management command.
        It finds the AppraisalTimer and updates its dates for the current year.
        """
        self.stdout.write("Starting yearly update for the AppraisalTimer...")

        try:
            # Assuming there is only one AppraisalTimer object
            timer, created = AppraisalTimer.objects.get_or_create()

            today = date.today()

            # Update the year for the start and end dates based on the current year
            # This preserves the month and day from the original dates.
            old_start_date = timer.review_period_start
            old_end_date = timer.review_period_end

            timer.review_period_start = date(today.year, old_start_date.month, old_start_date.day)
            timer.review_period_end = date(today.year, old_end_date.month, old_end_date.day)

            # Calculate the new remind date (7 days before the new end date)
            timer.remind_date = timer.review_period_end - timedelta(days=7)

            # Save the changes to the database
            timer.save()

            self.stdout.write(self.style.SUCCESS(
                f"Successfully updated AppraisalTimer. "
                f"New Period: {timer.review_period_start} to {timer.review_period_end}. "
                f"Reminder Date: {timer.remind_date}."
            ))

        except AppraisalTimer.DoesNotExist:
            self.stdout.write(self.style.ERROR("AppraisalTimer object not found. Please create one in the admin panel."))
            logger.error("AppraisalTimer object not found during yearly update.")
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"An unexpected error occurred: {e}"))
            logger.error(f"Failed to update AppraisalTimer: {e}", exc_info=True)
