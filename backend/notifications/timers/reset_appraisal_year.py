from datetime import date
from django.core.management.base import BaseCommand
from django.db import transaction, connection

from appraisals.models import EmployeeAppraisalTimer 

class Command(BaseCommand):

    help = 'Checks if today is Jan 1st. If so, resets the year for all appraisal timers.'

    def handle(self, *args, **options):
        # 1. Check Today's Date
        today = date.today()
        
        # Only proceed if today is January 1st
        if today.month != 1 or today.day != 1:
            self.stdout.write(self.style.WARNING(
                f"Skipping annual timer reset. Today is {today.strftime('%B %d')}, not January 1st."
            ))
            return # Exit gracefully if the condition is not met

        # If we reach here, it is January 1st, so we execute the annual logic.
        current_year = today.year
        
        self.stdout.write(self.style.NOTICE(
            f"*** JANUARY 1ST DETECTED *** Starting mass appraisal timer year reset for cycle year {current_year}..."
        ))
        
        updated_count = 0

        # Use a database transaction for safety
        with transaction.atomic():
            # 2. Iterate over all timer records
            timers = EmployeeAppraisalTimer.objects.all()
            
            for timer in timers:
                # Flag to check if any update was necessary
                needs_save = False

                # --- Helper function for dynamic year update ---
                def update_date_year(old_date):
                    nonlocal needs_save
                    if old_date and old_date.year != current_year:
                        needs_save = True
                        # Create a new date object with the current year
                        return date(current_year, old_date.month, old_date.day)
                    return old_date # Return original date if year is already correct

                # 3. Apply the update to all three fields
                timer.employee_self_appraisal_start = update_date_year(timer.employee_self_appraisal_start)
                timer.employee_self_appraisal_remind = update_date_year(timer.employee_self_appraisal_remind)
                timer.employee_self_appraisal_end = update_date_year(timer.employee_self_appraisal_end)
                
                # 4. Save only if a field was actually changed
                if needs_save:
                    timer.save(update_fields=[
                        'employee_self_appraisal_start', 
                        'employee_self_appraisal_remind', 
                        'employee_self_appraisal_end'
                    ])
                    updated_count += 1
            
            # Optional: Clear the database connection query cache
            connection.queries = []
            

        self.stdout.write(self.style.SUCCESS(
            f'Finished. Successfully updated the year for {updated_count} appraisal timer records.'
        ))
