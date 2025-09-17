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
    if created:
        # This block handles the initial self-appraisal submission
        # The EmployeeAppraisalTrack object is created when a self-appraisal is submitted.
        # So we send a notification to the reporting manager.
        employee = instance.employee
        reporting_manager_instance = employee.reporting_manager
        
        if reporting_manager_instance:
            Notification.objects.create(
                employee=reporting_manager_instance.manager,
                title="New Self-Appraisal Submitted",
                message=f"{employee.employee_name} has submitted their self-appraisal. It is now awaiting your review."
            )
            print(f"Notification sent to RM {reporting_manager_instance.manager.employee_name}")
    else:
        # This block handles status changes after the initial submission
        # The status changes when an RM, HR, HOD, COO, or CEO submits their review.
        
        employee = instance.employee
        status = instance.status

        # Find the next reviewer based on the updated status
        next_reviewer = None
        message = ""
        
        if status == 'rm':
            next_reviewer = Employee.objects.filter(reviewed_by_hr=True).first()
            message = f"The Reporting Manager review for {employee.employee_name} has been submitted. It is now awaiting your HR review."
            
        elif status == 'hr':
            # This is a bit complex as we need to check the next person in the hierarchy
            if employee.reviewed_by_hod:
                next_reviewer = Employee.objects.filter(reviewed_by_hod=True).first()
                message = f"The HR review for {employee.employee_name} has been submitted. It is now awaiting your HOD review."
            elif employee.reviewed_by_coo:
                next_reviewer = Employee.objects.filter(reviewed_by_coo=True).first()
                message = f"The HR review for {employee.employee_name} has been submitted. It is now awaiting your COO review."
            elif employee.reviewed_by_ceo:
                next_reviewer = Employee.objects.filter(reviewed_by_ceo=True).first()
                message = f"The HR review for {employee.employee_name} has been submitted. It is now awaiting your CEO review."

        elif status == 'hod':
            if employee.reviewed_by_coo:
                next_reviewer = Employee.objects.filter(reviewed_by_coo=True).first()
                message = f"The HOD review for {employee.employee_name} has been submitted. It is now awaiting your COO review."
            elif employee.reviewed_by_ceo:
                next_reviewer = Employee.objects.filter(reviewed_by_ceo=True).first()
                message = f"The HOD review for {employee.employee_name} has been submitted. It is now awaiting your CEO review."
                
        elif status == 'coo':
            if employee.reviewed_by_ceo:
                next_reviewer = Employee.objects.filter(reviewed_by_ceo=True).first()
                message = f"The COO review for {employee.employee_name} has been submitted. It is now awaiting your CEO review."
                
        if next_reviewer:
            Notification.objects.create(
                employee=next_reviewer,
                title="Review Submitted",
                message=message
            )
            print(f"Notification sent to {next_reviewer.employee_name}")
