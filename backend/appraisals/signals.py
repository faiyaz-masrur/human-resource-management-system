from django.db.models.signals import post_save
from django.dispatch import receiver
from appraisals.models import (
    EmployeeAppraisalTimer,
    EmployeeAppraisalStatusTrack,
    AppraisalDetails,
    AllAppraisalRecord,
)
from system.models import Employee


@receiver(post_save, sender=EmployeeAppraisalTimer)
def move_and_reset_completed_appraisals(sender, instance, created, **kwargs):
    """
    On creation of a new appraisal timer:
    1. Move fully reviewed employees from AppraisalDetails -> AllAppraisalRecord.
    2. Delete old AppraisalDetails of moved employees.
    3. Reset EmployeeAppraisalStatusTrack only for moved employees.
    """
    if not created:
        return  

    appraisal_details_qs = AppraisalDetails.objects.all()
    moved_count = 0

    for detail in appraisal_details_qs:
        emp = detail.employee
        track, _ = EmployeeAppraisalStatusTrack.objects.get_or_create(employee=emp)

        review_flags = [
            track.self_appraisal_done,
            track.rm_review_done,
            track.hr_review_done,
            track.hod_review_done,
            track.coo_review_done,
            track.ceo_review_done
        ]

        # Check if any field is "False" → incomplete
        if any(flag == "False" or flag is False for flag in review_flags):
            continue  # Skip incomplete appraisal

        # Move completed appraisal to AllAppraisalRecord
        AllAppraisalRecord.objects.create(
            employee=detail.employee,
            emp_appraisal=detail.emp_appraisal,
            rm_review=detail.rm_review,
            hr_review=detail.hr_review,
            hod_review=detail.hod_review,
            coo_review=detail.coo_review,
            ceo_review=detail.ceo_review,
            appraisal_period=detail.appraisal_period
        )
        detail.delete()
        moved_count += 1

        # Reset status track only for this employee
        track.self_appraisal_done = "False"
        track.rm_review_done = "NA"
        track.hr_review_done = "NA"
        track.hod_review_done = "NA"
        track.coo_review_done = "NA"
        track.ceo_review_done = "NA"
        track.save()

    print(f"Moved and reset {moved_count} completed appraisals.")
