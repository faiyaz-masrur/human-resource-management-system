from django.db.models.signals import post_save
from django.dispatch import receiver
from appraisals.models import EmployeeAppraisalTrack
from notifications.models import Notification
from employees.models import Employee, ReportingManager


@receiver(post_save, sender=EmployeeAppraisalTrack)
def send_review_notification(sender, instance, created, **kwargs):
    """
    Sends a real-time notification to the next reviewer in the hierarchy
    whenever the status of an appraisal track changes.
    """

    employee = instance.employee

    if created:
        # Initial self-appraisal submission → notify Reporting Manager
        reporting_manager_instance = getattr(employee, 'reporting_manager', None)
        if reporting_manager_instance:
            Notification.objects.create(
                employee=reporting_manager_instance.manager,
                title="New Self-Appraisal Submitted",
                message=f"{employee.employee_name} has submitted their self-appraisal. It is now awaiting your review."
            )
            print(f"Notification sent to RM {reporting_manager_instance.manager.employee_name}")
        return

    # --- Review Progress Notifications ---
    next_reviewer = None
    message = ""

    if instance.self_appraisal_done and not instance.rm_review_done:
        # Notify RM
        rm = getattr(employee, 'reporting_manager', None)
        if rm:
            next_reviewer = rm.manager
            message = f"{employee.employee_name} has completed self-appraisal. It is now awaiting your review."

    elif instance.rm_review_done and not instance.hr_review_done:
        # Notify HR (assuming you have a way to identify HR employees)
        next_reviewer = Employee.objects.filter(role="HR").first()
        if next_reviewer:
            message = f"The Reporting Manager review for {employee.employee_name} has been submitted. It is now awaiting your HR review."

    elif instance.hr_review_done and not instance.hod_review_done:
        next_reviewer = Employee.objects.filter(role="HOD").first()
        if next_reviewer:
            message = f"The HR review for {employee.employee_name} has been submitted. It is now awaiting your HOD review."

    elif instance.hod_review_done and not instance.coo_review_done:
        next_reviewer = Employee.objects.filter(role="COO").first()
        if next_reviewer:
            message = f"The HOD review for {employee.employee_name} has been submitted. It is now awaiting your COO review."

    elif instance.coo_review_done and not instance.ceo_review_done:
        next_reviewer = Employee.objects.filter(role="CEO").first()
        if next_reviewer:
            message = f"The COO review for {employee.employee_name} has been submitted. It is now awaiting your CEO review."

    elif instance.ceo_review_done:
        # Final stage completed
        Notification.objects.create(
            employee=employee,
            title="Appraisal Completed",
            message=f"Your appraisal process has been fully completed."
        )
        print(f"Notification sent to {employee.employee_name} for completion")
        return

    # Send notification if we found the next reviewer
    if next_reviewer and message:
        Notification.objects.create(
            employee=next_reviewer,
            title="Review Submitted",
            message=message
        )
        print(f"Notification sent to {next_reviewer.employee_name}")
