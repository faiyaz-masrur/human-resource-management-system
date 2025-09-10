from django.contrib import admin
from .models import (
    EmployeeAppraisal,
    AttendanceSummary,
    SalaryRecommendation,
    ReportingManagerReview,
    HRReview,
    FinalReview
)

@admin.register(EmployeeAppraisal)
class EmployeeAppraisalAdmin(admin.ModelAdmin):
    list_display = (
        'employee', 'review_period_start', 'review_period_end', 'is_review_period_active'
    )
    list_filter = ('is_review_period_active',)
    search_fields = ('employee__employee_name',)

@admin.register(AttendanceSummary)
class AttendanceSummaryAdmin(admin.ModelAdmin):
    list_display = (
        'employee', 'total_leave_taken', 'attendance_percentage', 'attendance_rating'
    )
    search_fields = ('employee__employee_name',)
    readonly_fields = ('total_leave_taken', 'attendance_percentage', 'attendance_rating')

@admin.register(SalaryRecommendation)
class SalaryRecommendationAdmin(admin.ModelAdmin):
    list_display = (
        'employee', 'current_basic', 'current_gross', 'proposed_basic', 'proposed_gross'
    )
    search_fields = ('employee__employee_name',)

@admin.register(ReportingManagerReview)
class ReportingManagerReviewAdmin(admin.ModelAdmin):
    list_display = (
        'appraisal', 'reviewer', 'overall_performance_rating', 'potential_rating'
    )
    list_filter = ('overall_performance_rating', 'potential_rating')
    search_fields = ('appraisal__employee__employee_name', 'reviewer__employee_name')

@admin.register(HRReview)
class HRReviewAdmin(admin.ModelAdmin):
    list_display = ('appraisal', 'reviewer')
    search_fields = ('appraisal__employee__employee_name', 'reviewer__employee_name')

@admin.register(FinalReview)
class FinalReviewAdmin(admin.ModelAdmin):
    list_display = ('appraisal', 'reviewer', 'reviewer_role')
    list_filter = ('reviewer_role',)
    search_fields = ('appraisal__employee__employee_name', 'reviewer__employee_name')
