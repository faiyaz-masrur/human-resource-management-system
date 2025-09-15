from django.contrib import admin
from .models import EmployeeAppraisalTimer, ReportingManagerAppraisalTimer


@admin.register(EmployeeAppraisalTimer)
class EmployeeAppraisalTimerAdmin(admin.ModelAdmin):
    list_display = ('employee_appraisal_start', 'employee_appraisal_end', 'employee_appraisal_remind')
    
    
    def has_add_permission(self, request):
        """
        Allows adding a new object only if no AppraisalTimer instance exists yet.
        This enforces the "only one active" appraisal period.
        """
        # This will query the database to count existing objects.
        return EmployeeAppraisalTimer.objects.count() == 0

    def has_delete_permission(self, request, obj=None):
        """
        Prevents deleting the last remaining instance to avoid an empty table.
        """
        return EmployeeAppraisalTimer.objects.count() > 1
    

@admin.register(ReportingManagerAppraisalTimer)
class ReportingManagerAppraisalTimerAdmin(admin.ModelAdmin):
    list_display = ('review_period_start', 'review_period_end', 'review_period_remind')
    
    
    def has_add_permission(self, request):
        """
        Allows adding a new object only if no AppraisalTimer instance exists yet.
        This enforces the "only one active" appraisal period.
        """
        # This will query the database to count existing objects.
        return ReportingManagerAppraisalTimer.objects.count() == 0

    def has_delete_permission(self, request, obj=None):
        """
        Prevents deleting the last remaining instance to avoid an empty table.
        """
        return ReportingManagerAppraisalTimer.objects.count() > 1
    

 
