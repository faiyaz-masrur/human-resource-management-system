from datetime import date, timedelta
from django.db.models.signals import post_save
from django.dispatch import receiver

# Assuming your models are imported like this relative to the app structure
from ...appraisals.models import EmployeeAppraisalTimer
# Adjust this import path if the Employee model is in a different app (e.g., 'system')
from system.models import Employee 

@receiver(post_save, sender=Employee)
def create_or_update_appraisal_timer(sender, instance, created, **kwargs):
    """
    Automatically creates or updates the EmployeeAppraisalTimer whenever an
    Employee record is saved.
    
    The logic proceeds IF:
    1. The instance was just created (created=True).
    2. The instance was updated (created=False) AND the 'joining_date' field 
       was specifically saved.
    """
    employee = instance
    joining_date = employee.joining_date
    
    # --- CHECK 1: Skip if no joining date ---
    if not joining_date:
        print(f"Signal skipped: Employee ID {employee.id} has no joining date.")
        return

    # --- CHECK 2: Skip if update, but joining_date wasn't changed ---
    if not created:
        update_fields = kwargs.get('update_fields')
        # Check if a subset of fields was saved, and 'joining_date' is NOT in that subset.
        # If update_fields is None, it means a full save() was called, and we assume we should proceed.
        if update_fields is not None and 'joining_date' not in update_fields:
            print(f"Signal skipped: Employee ID {employee.id} updated, but joining_date was unchanged.")
            return

    # --- Proceed with timer calculation (Logic remains unchanged) ---
    
    current_date = date.today()
    
    # 1. Determine the target year for the standard (March) appraisal cycle
    if created:
        # New employee: Standard cycle starts next year
        target_year = current_date.year + 1
    else:
        # Existing employee: The timer is being updated for the current year's cycle (e.g., 2025)
        target_year = current_date.year
        
    # Define the cutoff date using the determined target year.
    # Note: We use April 1st as the standard start of the new appraisal year.
    CUTOFF_DATE_STANDARD_CYCLE = date(2023, 4, 1) # Retaining 2023 as fixed reference point
    
    appraisal_start = None
    appraisal_remind = None
    appraisal_end = None
    
    
    # --- Case 1: Standard Cycle Eligibility ---
    if joining_date < CUTOFF_DATE_STANDARD_CYCLE:
        # Set fixed March dates using the calculated target_year
        appraisal_start = date(target_year, 3, 1)
        appraisal_remind = date(target_year, 3, 15)
        appraisal_end = date(target_year, 3, 31)
        
        cycle_type = "STANDARD"
    
    # --- Case 2: Prorated Cycle ---
    else:
        # Prorated dates are always based on the actual joining date
        appraisal_start = joining_date
        # Reminder date is Joining Date + 14 days
        appraisal_remind = joining_date + timedelta(days=14)
        # End date is Joining Date + 29 days (A 30-day window)
        appraisal_end = joining_date + timedelta(days=29)
        
        cycle_type = "PRORATED"

    # Create or update the EmployeeAppraisalTimer record
    timer_instance, was_created = EmployeeAppraisalTimer.objects.update_or_create(
        employee_id=employee,  # Match the timer to the employee
        defaults={
            'employee_self_appraisal_start': appraisal_start,
            'employee_self_appraisal_remind': appraisal_remind,
            'employee_self_appraisal_end': appraisal_end,
        }
    )
    
    action = "CREATED" if was_created else "UPDATED"
    print(f"Appraisal Timer {action} for {employee.id} ({cycle_type}): {appraisal_start} to {appraisal_end}")


