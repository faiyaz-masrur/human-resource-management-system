from django.contrib import admin
from .models import EmployeeAppraisalTimer, ReportingManagerAppraisalTimer, ReviewerAppraisalTimer


@admin.register(EmployeeAppraisalTimer)
class EmployeeAppraisalTimerAdmin(admin.ModelAdmin):
    list_display = ('employee_appraisal_start', 'employee_appraisal_end', 'employee_appraisal_remind')

    def has_add_permission(self, request):
        """
        Allows adding a new object only if no AppraisalTimer instance exists yet.
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


@admin.register(ReviewerAppraisalTimer)
class ReviewerAppraisalTimerAdmin(admin.ModelAdmin):
    list_display = ('reviewer_period_start', 'reviewer_period_end', 'reviewer_period_remind')

    def has_add_permission(self, request):
        """
        Allows adding a new object only if no ReviewerAppraisalTimer exists yet.
        """
        return ReviewerAppraisalTimer.objects.count() == 0

    def has_delete_permission(self, request, obj=None):
        """
        Prevents deleting the last remaining instance.
        """
        return ReviewerAppraisalTimer.objects.count() > 1
