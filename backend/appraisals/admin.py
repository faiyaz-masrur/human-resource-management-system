'''
from django.contrib import admin
from .models import EmployeeAppraisalTimer, ReportingManagerAppraisalTimer, FinalReviewerAppraisalTimer


@admin.register(EmployeeAppraisalTimer)
class EmployeeAppraisalTimerAdmin(admin.ModelAdmin):
    list_display = ('employee_self_appraisal_start', 'employee_self_appraisal_end', 'employee_self_appraisal_remind')

    def has_add_permission(self, request):
        """
        Allows adding a new object only if no EmployeeAppraisalTimer instance exists yet.
        This enforces the "only one active" appraisal period.
        """
        return EmployeeAppraisalTimer.objects.count() == 0

    def has_delete_permission(self, request, obj=None):
        """
        Prevents deleting the last remaining instance to avoid an empty table.
        """
        return EmployeeAppraisalTimer.objects.count() > 1


@admin.register(ReportingManagerAppraisalTimer)
class ReportingManagerAppraisalTimerAdmin(admin.ModelAdmin):
    list_display = ('reporting_manager_review_start', 'reporting_manager_review_end', 'reporting_manager_review_remind')

    def has_add_permission(self, request):
        """
        Allows adding a new object only if no ReportingManagerAppraisalTimer exists yet.
        """
        return ReportingManagerAppraisalTimer.objects.count() == 0

    def has_delete_permission(self, request, obj=None):
        """
        Prevents deleting the last remaining instance.
        """
        return ReportingManagerAppraisalTimer.objects.count() > 1


@admin.register(FinalReviewerAppraisalTimer)
class FinalReviewerAppraisalTimerAdmin(admin.ModelAdmin):
    list_display = ('final_review_start', 'final_review_end', 'final_review_remind')

    def has_add_permission(self, request):
        """
        Allows adding a new object only if no FinalReviewerAppraisalTimer exists yet.
        """
        return FinalReviewerAppraisalTimer.objects.count() == 0

    def has_delete_permission(self, request, obj=None):
        """
        Prevents deleting the last remaining instance.
        """
        return FinalReviewerAppraisalTimer.objects.count() > 1

'''