from datetime import date, timedelta
from django.db.models.signals import post_save
from django.dispatch import receiver

from ...appraisals.models import EmployeeAppraisalTimer
from system.models import Employee 


@receiver(post_save, sender=Employee)
def create_or_update_appraisal_timer(sender, instance, created, **kwargs):
    employee = instance
    joining_date = employee.joining_date

    # --- CHECK 1: Skip if no joining date ---
    if not joining_date:
        print(f"Signal skipped: Employee ID {employee.id} has no joining date.")
        return

    # --- CHECK 2: Skip if update, but joining_date wasn't changed ---
    if not created:
        update_fields = kwargs.get('update_fields')
        if update_fields is not None and 'joining_date' not in update_fields:
            print(f"Signal skipped: Employee ID {employee.id} updated, but joining_date was unchanged.")
            return

    current_date = date.today()

    # 1. Determine the target year for the standard (March) appraisal cycle
    if created:
        target_year = current_date.year + 1
    else:
        target_year = current_date.year

    # Fixed reference for standard cycle cutoff
    CUTOFF_DATE_STANDARD_CYCLE = date(2023, 4, 1)

    appraisal_start = None
    appraisal_remind = None
    appraisal_end = None

    # --- Case 1: Standard Cycle Eligibility ---
    if joining_date < CUTOFF_DATE_STANDARD_CYCLE:
        appraisal_start = date(target_year, 3, 1)
        appraisal_remind = date(target_year, 3, 15)
        appraisal_end = date(target_year, 3, 31)
        cycle_type = "STANDARD"

    # --- Case 2: Prorated Cycle ---
    else:
        # Start date = 1st day of joining month
        appraisal_start = date(joining_date.year, joining_date.month, 1)
        # Reminder = start + 14 days (same as joining day in many cases)
        appraisal_remind = appraisal_start + timedelta(days=14)
        # End = start + 29 days (30-day window)
        appraisal_end = appraisal_start + timedelta(days=29)
        cycle_type = "PRORATED"

    # Create or update the EmployeeAppraisalTimer record
    timer_instance, was_created = EmployeeAppraisalTimer.objects.update_or_create(
        employee_id=employee,
        defaults={
            'employee_self_appraisal_start': appraisal_start,
            'employee_self_appraisal_remind': appraisal_remind,
            'employee_self_appraisal_end': appraisal_end,
        }
    )

    action = "CREATED" if was_created else "UPDATED"
    print(
        f"Appraisal Timer {action} for Employee {employee.id} ({cycle_type}): "
        f"{appraisal_start} → {appraisal_end}"
    )
