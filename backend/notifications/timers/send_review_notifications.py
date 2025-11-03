from datetime import date, timedelta
from django.db.models.signals import post_save
from django.dispatch import receiver
from appraisals.models import EmployeeAppraisalStatus
from notifications.models import Notification
from employees.models import Employee, Hr, Hod, Coo, Ceo


@receiver(post_save, sender=EmployeeAppraisalStatus)
def send_review_notification(sender, instance, created, **kwargs):
    """
    Sends notifications to the next reviewer in the hierarchy and to the submitter
    only if the current date is within the global appraisal period.
    """

    if created:
        return
    
    if instance.self_appraisal_done == "PENDING":
        return

    employee = instance.employee
    

    # --- Notification logic ---
    list = []
    employee_message = ""

    if instance.self_appraisal_done == "DONE" and instance.rm_review_done == "PENDING":

        rm = getattr(employee, 'reporting_manager', None)
        if rm:
            dict = {
                "next_reviewer": rm.manager,
                "reviewer_message": f"{employee.name}'s appraisal is now awaiting for your RM review.",
            }
            list.append(dict)
            employee_message = "Your appraisal is currently under review by Reporting Manager.",
    

    elif instance.self_appraisal_done == "DONE" and instance.hr_review_done == "PENDING":

        next_reviewers = Hr.objects.all()
        for next_reviewer in next_reviewers:
            if next_reviewer:
                dict = {
                    "next_reviewer" : next_reviewer,
                    "reviewer_message" : f"{employee.name}'s appraisal is now awaiting for your HR review.",
                }
                list.append(dict)
                employee_message = "Your appraisal is currently under review by HR.",


    elif instance.self_appraisal_done == "DONE" and instance.hod_review_done == "PENDING":

        next_reviewers = Hod.objects.all()
        for next_reviewer in next_reviewers:
            if next_reviewer:
                dict = {
                    "next_reviewer" :   next_reviewer,
                    "reviewer_message" : f"{employee.name}'s appraisal is now awaiting for your HOD review.",
                }
                list.append(dict)
                employee_message = "Your appraisal is currently under review by HOD."


    elif instance.self_appraisal_done == "DONE" and instance.coo_review_done == "PENDING":

        next_reviewers = Coo.objects.all()
        for next_reviewer in next_reviewers:
            if next_reviewer:
                dict = {
                    "next_reviewer" :   next_reviewer,
                    "reviewer_message" : f"{employee.name}'s appraisal is now awaiting for your COO review.",
                }
                list.append(dict)
                employee_message = "Your appraisal is currently under review by COO."


    elif instance.self_appraisal_done == "DONE" and instance.ceo_review_done == "PENDING":

        next_reviewer = Ceo.objects.all()
        for next_reviewer in next_reviewers:
            if next_reviewer:
                dict = {
                    "next_reviewer" :   next_reviewer,
                    "reviewer_message" : f"{employee.name}'s appraisal is now awaiting for your CEO review.",
                }
                list.append(dict)
                employee_message = "Your appraisal is currently under review by CEO."


    elif (instance.self_appraisal_done != "PENDING" and 
          instance.rm_review_done != "PENDING" and
          instance.hr_review_done != "PENDING" and
          instance.hod_review_done != "PENDING" and
          instance.coo_review_done != "PENDING" and
          instance.ceo_review_done != "PENDING"):
        
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
