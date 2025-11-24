# app/tasks.py
from celery import shared_task
from datetime import date
from .models import EmployeeAppraisalTimer, AppraisalDetailsBackup

@shared_task
def monthly_appraisal_task():
    today = date.today()
    
    # Fetch timers with related objects to reduce queries
    timers = EmployeeAppraisalTimer.objects.filter(
        employee_self_appraisal_start=today
    ).select_related(
        'employee',
        'employee__appraisal_details',
        'employee__employee_appraisal_status'
    )

    for timer in timers:
        employee = timer.employee
        appraisalDetails = getattr(employee, 'appraisal_details', None)
        appraisalStatus = getattr(employee, 'employee_appraisal_status', None)

        if not appraisalDetails:
            continue  # skip if no AppraisalDetails

        if appraisalStatus:
            appraisalStatus.appraisal_date = timer.employee_self_appraisal_start if timer else None
            appraisalStatus.self_appraisal_done = 'PENDING'
            appraisalStatus.rm_review_done = 'PENDING' if employee.reviewed_by_rm else 'NA'
            appraisalStatus.hr_review_done = 'PENDING' if employee.reviewed_by_hr else 'NA'
            appraisalStatus.hod_review_done = 'PENDING' if employee.reviewed_by_hod else 'NA'
            appraisalStatus.coo_review_done = 'PENDING' if employee.reviewed_by_coo else 'NA'
            appraisalStatus.ceo_review_done = 'PENDING' if employee.reviewed_by_ceo else 'NA'
            appraisalStatus.save()

        # Backup AppraisalDetails only if emp_appraisal exists
        if appraisalDetails.emp_appraisal:
            AppraisalDetailsBackup.objects.create(
            employee=employee,  # `employee` is an Employee instance
            reporting_manager=appraisalDetails.reporting_manager,
            emp_appraisal=appraisalDetails.emp_appraisal,
            rm_review=appraisalDetails.rm_review,
            hr_review=appraisalDetails.hr_review,
            hod_review=appraisalDetails.hod_review,
            coo_review=appraisalDetails.coo_review,
            ceo_review=appraisalDetails.ceo_review,
            appraisal_start_date=appraisalDetails.appraisal_start_date,
            appraisal_end_date=appraisalDetails.appraisal_end_date,
            factor=appraisalDetails.factor,
        )

        # Reset AppraisalDetails fields for new cycle
        appraisalDetails.reporting_manager = employee.reporting_manager
        appraisalDetails.emp_appraisal = None
        appraisalDetails.rm_review = None
        appraisalDetails.hr_review = None
        appraisalDetails.hod_review = None
        appraisalDetails.coo_review = None
        appraisalDetails.ceo_review = None
        appraisalDetails.appraisal_status = appraisalStatus if appraisalStatus else None
        appraisalDetails.appraisal_start_date = timer.employee_self_appraisal_start
        appraisalDetails.appraisal_end_date = timer.employee_self_appraisal_end
        appraisalDetails.factor = 0.55
        appraisalDetails.save()

        
