from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from appraisals.models import (
    EmployeeAppraisalTimer,
    EmployeeAppraisalStatusTrack,
    AppraisalDetails,
    AllAppraisalRecord,
)
from system.models import Employee 


def _reset_track_status(current_value):

    if current_value is None or current_value == "NA":
        return current_value

    return "False"


@receiver(post_save, sender=EmployeeAppraisalTimer)
def move_and_reset_appraisals_on_period_end(sender, instance, created, **kwargs):
    
    now = timezone.now()
    
    # 1. ENFORCE TIME CONSTRAINT: Only run on the 1st day of the month at 3 AM hour.

    if now.day != 1 or now.hour != 3:
        return

    # 2. Get all active appraisals
    appraisal_details_qs = AppraisalDetails.objects.all()
    records_to_create = []
    
    # Use a dictionary to track employee tracks for efficient update later
    employees_to_reset_tracks = {}
    moved_count = 0

    # 3. Iterate through active appraisals and apply the yearly check
    for detail in appraisal_details_qs:
        emp = detail.employee
        
        try:
            track = EmployeeAppraisalStatusTrack.objects.get(employee=emp)
        except EmployeeAppraisalStatusTrack.DoesNotExist:
            print(f"WARNING: Status track not found for employee {emp.id}. Skipping archival.")
            continue

        last_archived_date = getattr(track, 'last_archived_date', None)
        
        if last_archived_date and last_archived_date.year == now.year:

            print(f"Skipping employee {emp.id}: Already archived this year ({now.year}).")
            continue

        records_to_create.append(
            AllAppraisalRecord(
                employee=emp,
                emp_appraisal=detail.emp_appraisal,
                rm_review=detail.rm_review,
                hr_review=detail.hr_review,
                hod_review=detail.hod_review,
                coo_review=detail.coo_review,
                ceo_review=detail.ceo_review,
                appraisal_period=detail.appraisal_period
            )
        )

        employees_to_reset_tracks[emp.id] = track
        setattr(track, 'last_archived_date', now)
        
        moved_count += 1

    if records_to_create:
        AllAppraisalRecord.objects.bulk_create(records_to_create)

    # 4. Reset the status track for the moved employees
    for emp_id, track in employees_to_reset_tracks.items():
        
        track.self_appraisal_done = _reset_track_status(track.self_appraisal_done)
        track.rm_review_done = _reset_track_status(track.rm_review_done)
        track.hr_review_done = _reset_track_status(track.hr_review_done)
        track.hod_review_done = _reset_track_status(track.hod_review_done)
        track.coo_review_done = _reset_track_status(track.coo_review_done)
        track.ceo_review_done = _reset_track_status(track.ceo_review_done)
        
        track.save(update_fields=[
            'self_appraisal_done', 'rm_review_done', 'hr_review_done', 
            'hod_review_done', 'coo_review_done', 'ceo_review_done',
            'last_archived_date'
        ])

    # 5. Remove data from AppraisalDetails table for the archived records
    if employees_to_reset_tracks:
        # Filter AppraisalDetails to delete only the records corresponding to the employees we just moved
        AppraisalDetails.objects.filter(employee__id__in=employees_to_reset_tracks.keys()).delete()

    print(f"Archived and reset {moved_count} appraisal records based on the 1st of the month, 3 AM yearly cutoff.")
