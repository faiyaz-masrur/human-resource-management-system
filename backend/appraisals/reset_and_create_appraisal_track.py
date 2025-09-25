from django.db.models.signals import post_save
from django.dispatch import receiver
from appraisals.models import EmployeeAppraisalTimer, EmployeeAppraisalTrack, EmployeeAppraisalTrackBackup
from employees.models import Employee


@receiver(post_save, sender=EmployeeAppraisalTimer)
def reset_and_create_appraisal_tracks(sender, instance, created, **kwargs):
    """
    On creation of a new appraisal timer:
    1. Backup all existing EmployeeAppraisalTrack data.
    2. Delete old tracks.
    3. Create fresh tracks for all employees.
    """
    if not created:
        return  # Only on new timer creation

    # --- Step 1: Backup old data ---
    old_tracks = EmployeeAppraisalTrack.objects.all()
    backups = [
        EmployeeAppraisalTrackBackup(
            employee=track.employee,
            last_updated=track.last_updated,
            self_appraisal_done=track.self_appraisal_done,
            rm_review_done=track.rm_review_done,
            hr_review_done=track.hr_review_done,
            hod_review_done=track.hod_review_done,
            coo_review_done=track.coo_review_done,
            ceo_review_done=track.ceo_review_done,
        )
        for track in old_tracks
    ]
    EmployeeAppraisalTrackBackup.objects.bulk_create(backups)
    print(f"Backed up {len(backups)} appraisal tracks.")

    # --- Step 2: Delete old data ---
    old_tracks.delete()
    print("Deleted all old appraisal tracks.")

    # --- Step 3: Create fresh tracks ---
    employees = Employee.objects.all()
    new_tracks = []
    for employee in employees:
        new_tracks.append(EmployeeAppraisalTrack(
            employee=employee,
            self_appraisal_done="False",
            rm_review_done="True" if employee.reviewed_by_rm else "False",
            hr_review_done="True" if employee.is_hr and employee.reviewed_by_hr else "False",
            hod_review_done="True" if employee.reviewed_by_hod else "False",
            coo_review_done="True" if employee.reviewed_by_coo else "False",
            ceo_review_done="True" if employee.reviewed_by_ceo else "False",
        ))
    EmployeeAppraisalTrack.objects.bulk_create(new_tracks)
    print(f"Created {len(new_tracks)} new appraisal tracks.")
