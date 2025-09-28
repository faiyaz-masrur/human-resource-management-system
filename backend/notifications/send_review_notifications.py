from datetime import date, timedelta
from django.db.models.signals import post_save
from django.dispatch import receiver
from appraisals.models import EmployeeAppraisalTrack, EmployeeAppraisalTimer
from notifications.models import Notification
from employees.models import Employee


@receiver(post_save, sender=EmployeeAppraisalTrack)
def send_review_notification(sender, instance, created, **kwargs):
    """
    Sends notifications to the next reviewer in the hierarchy and to the submitter
    only if the current date is within the global appraisal period.
    """

    if created:
        return
    
    if instance.self_appraisal_done == "False":
        return

    employee = instance.employee
    

    # --- Notification logic ---
    list = []
    employee_message = ""

    if instance.self_appraisal_done == "True" and instance.rm_review_done == "False":
        rm = getattr(employee, 'reporting_manager', None)
        if rm:
            dict = {
                "next_reviewer": rm.manager,
                "reviewer_message": f"{employee.name} has completed self-appraisal. It is now awaiting your review.",
            }
            list.append(dict)
            employee_message = "Your self-appraisal has been submitted and is now under review by your Reporting Manager.",
    elif instance.rm_review_done == "True" and instance.hr_review_done == "False":
        next_reviewers = Employee.objects.filter(is_hr=True)
        for next_reviewer in next_reviewers:
            if next_reviewer:
                dict = {
                    "next_reviewer" : next_reviewer,
                    "reviewer_message" : f"The Reporting Manager review for {employee.name} has been submitted. It is now awaiting your HR review.",
                }
                list.append(dict)
                employee_message = "Your appraisal has been reviewed by the Reporting Manager. HR will review it next."
    elif instance.hr_review_done == "True" and instance.hod_review_done == "False":
        next_reviewers = Employee.objects.filter(role="HOD")
        for next_reviewer in next_reviewers:
            if next_reviewer:
                dict = {
                    "next_reviewer" :   next_reviewer,
                    "reviewer_message" : f"The HR review for {employee.name} has been submitted. It is now awaiting your HOD review.",
                }
                list.append(dict)
                employee_message = "Your appraisal has been reviewed by HR. HOD will review it next."
    elif instance.hod_review_done == "True" and instance.coo_review_done == "False":
        next_reviewers = Employee.objects.filter(role="COO")
        for next_reviewer in next_reviewers:
            if next_reviewer:
                dict = {
                    "next_reviewer" :   next_reviewer,
                    "reviewer_message" : f"The HOD review for {employee.name} has been submitted. It is now awaiting your COO review."
                }
                list.append(dict)
                employee_message = "Your appraisal has been reviewed by HOD. COO will review it next."
    elif instance.coo_review_done == "True" and instance.ceo_review_done == "False":
        next_reviewer = Employee.objects.filter(role="CEO")
        for next_reviewer in next_reviewers:
            if next_reviewer:
                dict = {
                    "next_reviewer" :   next_reviewer,
                    "reviewer_message" : f"The COO review for {employee.name} has been submitted. It is now awaiting your CEO review.",
                }
                list.append(dict)
                employee_message = "Your appraisal has been reviewed by COO. CEO will review it next."
    elif (instance.self_appraisal_done == "True" and 
          instance.rm_review_done == "True" and
          instance.hr_review_done == "True" and
          instance.hod_review_done == "True" and
          instance.coo_review_done == "True" and
          instance.ceo_review_done == "True"):
        
        employee_message = "Your appraisal process has been fully completed."


    # Send notification to the next reviewer
    for item in list:
        if item:
            next_reviewer = item["next_reviewer"]
            reviewer_message = item["reviewer_message"]
            if next_reviewer and reviewer_message:
                Notification.objects.create(
                    employee=next_reviewer,
                    title="Review Submitted",
                    message=reviewer_message
                )


    # Send notification to the submitter
    if employee_message:
        Notification.objects.create(
            employee=employee,
            title="Appraisal Update",
            message=employee_message
        )
