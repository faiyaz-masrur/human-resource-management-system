from datetime import date
from django.db.models.signals import post_save
from django.dispatch import receiver

from appraisals.models import EmployeeAppraisalTimer, EmployeeAppraisalStatus, AppraisalDetails
from employees.models import WorkExperience
from system.models import Employee, RolePermission, ReportingManager, Hr, Hod, Coo, Ceo



@receiver(post_save, sender=Employee)
def create_or_update_appraisal_timer(sender, instance, created, **kwargs):
    employee = instance
    joining_date = employee.joining_date
    role = employee.role
    current_date = date.today()


    if created:


        WorkExperience.objects.create(
            employee=employee,
            organization="Sonali Intellect Limited",
            designation= employee.designation.name if employee.designation else "",
            department= employee.department.name if employee.department else "",
            start_date= employee.joining_date if employee.joining_date else current_date,
            end_date=None,
        )


        if role:
            employee_review_permission_list = RolePermission.objects.filter(
                role=role, 
                workspace='ReviewAppraisal',
            )

            for employee_review_permission in employee_review_permission_list:
                if employee_review_permission.sub_workspace == 'EmployeeRmReview' and (
                    employee_review_permission.create or employee_review_permission.edit):

                    ReportingManager.objects.get_or_create(manager=employee)

                elif employee_review_permission.sub_workspace == 'EmployeeHrReview' and (
                    employee_review_permission.create or employee_review_permission.edit):

                    Hr.objects.get_or_create(hr=employee)

                elif employee_review_permission.sub_workspace == 'EmployeeHodReview' and (
                    employee_review_permission.create or employee_review_permission.edit):

                    Hod.objects.get_or_create(hod=employee)

                elif employee_review_permission.sub_workspace == 'EmployeeCooReview' and (
                    employee_review_permission.create or employee_review_permission.edit):

                    Coo.objects.get_or_create(coo=employee)

                elif employee_review_permission.sub_workspace == 'EmployeeCeoReview' and (
                    employee_review_permission.create or employee_review_permission.edit):

                    Ceo.objects.get_or_create(ceo=employee)

        employee_appraisal_timer = None
        if joining_date: 
            employee_appraisal_timer = EmployeeAppraisalTimer.objects.get_or_create(
                employee=employee,
                defaults={
                    "employee_self_appraisal_start": date(current_date.year+1, 3, 1) if joining_date < date(2023, 4, 1)
                    else date(current_date.year+1, joining_date.month, 1),
                    "employee_self_appraisal_remind": date(current_date.year+1, 3, 15) if joining_date < date(2023, 4, 1)
                    else date(current_date.year+1, joining_date.month, 15),
                    "employee_self_appraisal_end": date(current_date.year+1, 3, 30) if joining_date < date(2023, 4, 1)
                    else date(current_date.year+1, joining_date.month, 30),
                }
            )

        appraisalDetails = AppraisalDetails.objects.create(
            employee=employee, 
            reporting_manager=employee.reporting_manager,
            appraisal_start_date=employee_appraisal_timer.employee_self_appraisal_start if employee_appraisal_timer else None,
            appraisal_end_date=employee_appraisal_timer.employee_self_appraisal_end if employee_appraisal_timer else None,
            factor=0.55,    
        )

        employee_appraisal_status = EmployeeAppraisalStatus.objects.create(employee=employee)

        review_mappings = [
            ('reviewed_by_rm', 'rm_review_done'),
            ('reviewed_by_hr', 'hr_review_done'),
            ('reviewed_by_hod', 'hod_review_done'),
            ('reviewed_by_coo', 'coo_review_done'),
            ('reviewed_by_ceo', 'ceo_review_done'),
        ]
        
        for employee_attr, status_attr in review_mappings:
            is_review_required = getattr(employee, employee_attr, False) 
            
            if is_review_required:
                setattr(employee_appraisal_status, status_attr, 'PENDING')
        
        employee_appraisal_status.appraisalDetails = appraisalDetails if appraisalDetails else None
        employee_appraisal_status.appraisal_date = employee_appraisal_timer.employee_self_appraisal_start if employee_appraisal_timer else None
        employee_appraisal_status.save()
        

    else:


        update_fields = kwargs.get('update_fields') or []

        if 'joining_date' in update_fields:
            employee_appraisal_timer = EmployeeAppraisalTimer.objects.update_or_create(
                employee=employee,
                defaults={
                    "employee_self_appraisal_start": date(current_date.year+1, 3, 1) if joining_date < date(2023, 4, 1)
                    else date(current_date.year+1, joining_date.month, 1),
                    "employee_self_appraisal_remind": date(current_date.year+1, 3, 15) if joining_date < date(2023, 4, 1)
                    else date(current_date.year+1, joining_date.month, 15),
                    "employee_self_appraisal_end": date(current_date.year+1, 3, 30) if joining_date < date(2023, 4, 1)
                    else date(current_date.year+1, joining_date.month, 30),
                }
            )

            AppraisalDetails.objects.update_or_create(
                employee=employee,
                defaults={
                    "appraisal_start_date": employee_appraisal_timer.employee_self_appraisal_start if employee_appraisal_timer else None,
                    "appraisal_end_date": employee_appraisal_timer.employee_self_appraisal_end if employee_appraisal_timer else None,
                }
            )

            EmployeeAppraisalStatus.objects.update_or_create(
                employee=employee,
                defaults={
                    "appraisal_date": employee_appraisal_timer.employee_self_appraisal_start if employee_appraisal_timer else None,
                }
            )


        if 'role' in update_fields:
            employee_review_permission_list = RolePermission.objects.filter(
                role=role,
                workspace='ReviewAppraisal',
            )

            for employee_review_permission in employee_review_permission_list:

                if employee_review_permission.sub_workspace == 'EmployeeRmReview':
                    
                    has_permission = employee_review_permission.create or employee_review_permission.edit
                    is_rm = ReportingManager.objects.filter(manager=employee).exists()

                    if has_permission and not is_rm:
                        ReportingManager.objects.create(manager=employee)
                    elif not has_permission and is_rm:
                        ReportingManager.objects.filter(manager=employee).delete()

                elif employee_review_permission.sub_workspace == 'EmployeeHrReview':

                    has_permission = employee_review_permission.create or employee_review_permission.edit
                    is_hr = Hr.objects.filter(hr=employee).exists()

                    if has_permission and not is_hr:
                        Hr.objects.create(hr=employee)
                    elif not has_permission and is_hr:
                        Hr.objects.filter(hr=employee).delete()

                elif employee_review_permission.sub_workspace == 'EmployeeHodReview':

                    has_permission = employee_review_permission.create or employee_review_permission.edit
                    is_hod = Hod.objects.filter(hod=employee).exists()

                    if has_permission and not is_hod:
                        Hod.objects.create(hod=employee)
                    elif not has_permission and is_hod:
                        Hod.objects.filter(hod=employee).delete()

                elif employee_review_permission.sub_workspace == 'EmployeeCooReview':

                    has_permission = employee_review_permission.create or employee_review_permission.edit
                    is_coo = Coo.objects.filter(coo=employee).exists()

                    if has_permission and not is_coo:
                        Coo.objects.create(coo=employee)
                    elif not has_permission and is_coo:
                        Coo.objects.filter(coo=employee).delete()

                elif employee_review_permission.sub_workspace == 'EmployeeCeoReview':

                    has_permission = employee_review_permission.create or employee_review_permission.edit
                    is_ceo = Ceo.objects.filter(ceo=employee).exists()

                    if has_permission and not is_ceo:
                        Ceo.objects.create(ceo=employee)
                    elif not has_permission and is_ceo:
                        Ceo.objects.filter(ceo=employee).delete()


