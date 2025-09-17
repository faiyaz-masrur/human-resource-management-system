from django.db.models.signals import post_save
from django.dispatch import receiver
from appraisals.models import EmployeeAppraisalTrack
from notifications.models import Notification
from employees.models import Employee


@receiver(post_save, sender=EmployeeAppraisalTrack)
def send_review_notification(sender, instance, created, **kwargs):
    """
    Sends notifications to the next reviewer in the hierarchy and to the submitter
    whenever the status of an appraisal track changes.
    """

    employee = instance.employee

    if created:
        # Initial self-appraisal submission → notify Reporting Manager & employee
        rm_instance = getattr(employee, 'reporting_manager', None)
        if rm_instance:
            Notification.objects.create(
                employee=rm_instance.manager,
                title="New Self-Appraisal Submitted",
                message=f"{employee.employee_name} has submitted their self-appraisal. It is now awaiting your review."
            )
            print(f"Notification sent to RM {rm_instance.manager.employee_name}")

        Notification.objects.create(
            employee=employee,
            title="Self-Appraisal Submitted",
            message="You have successfully submitted your self-appraisal."
        )
        print(f"Notification sent to {employee.employee_name}")
        return

    # --- Review Progress Notifications ---
    next_reviewer = None
    reviewer_message = ""
    employee_message = ""

    if instance.self_appraisal_done and not instance.rm_review_done:
        rm = getattr(employee, 'reporting_manager', None)
        if rm:
            next_reviewer = rm.manager
            reviewer_message = f"{employee.employee_name} has completed self-appraisal. It is now awaiting your review."
            employee_message = "Your self-appraisal has been submitted and is now under review by your Reporting Manager."

    elif instance.rm_review_done and not instance.hr_review_done:
        next_reviewer = Employee.objects.filter(role="HR").first()
        if next_reviewer:
            reviewer_message = f"The Reporting Manager review for {employee.employee_name} has been submitted. It is now awaiting your HR review."
            employee_message = "Your appraisal has been reviewed by the Reporting Manager. HR will review it next."

    elif instance.hr_review_done and not instance.hod_review_done:
        next_reviewer = Employee.objects.filter(role="HOD").first()
        if next_reviewer:
            reviewer_message = f"The HR review for {employee.employee_name} has been submitted. It is now awaiting your HOD review."
            employee_message = "Your appraisal has been reviewed by HR. HOD will review it next."

    elif instance.hod_review_done and not instance.coo_review_done:
        next_reviewer = Employee.objects.filter(role="COO").first()
        if next_reviewer:
            reviewer_message = f"The HOD review for {employee.employee_name} has been submitted. It is now awaiting your COO review."
            employee_message = "Your appraisal has been reviewed by HOD. COO will review it next."

    elif instance.coo_review_done and not instance.ceo_review_done:
        next_reviewer = Employee.objects.filter(role="CEO").first()
        if next_reviewer:
            reviewer_message = f"The COO review for {employee.employee_name} has been submitted. It is now awaiting your CEO review."
            employee_message = "Your appraisal has been reviewed by COO. CEO will review it next."

    elif instance.ceo_review_done:
        # Final stage completed
        Notification.objects.create(
            employee=employee,
            title="Appraisal Completed",
            message="Your appraisal process has been fully completed."
        )
        print(f"Notification sent to {employee.employee_name} for completion")
        return

    # Send notification to the next reviewer
    if next_reviewer and reviewer_message:
        Notification.objects.create(
            employee=next_reviewer,
            title="Review Submitted",
            message=reviewer_message
        )
        print(f"Notification sent to {next_reviewer.employee_name}")

    # Send notification to the submitter
    if employee_message:
        Notification.objects.create(
            employee=employee,
            title="Appraisal Update",
            message=employee_message
        )
        print(f"Notification sent to {employee.employee_name}")
