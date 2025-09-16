from rest_framework import serializers
from .models import (
    EmployeeAppraisal,
    EmployeeAppraisalTimer,
    ReportingManagerAppraisalTimer,
    ReviewerAppraisalTimer,
    AttendanceSummary,
    SalaryVariance,
    ReportingManagerReview,
    HRReview,
    FinalReview
)

# --- Timer Serializers ---

class EmployeeAppraisalTimerSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeAppraisalTimer
        fields = ['employee_appraisal_start', 'employee_appraisal_end', 'employee_appraisal_remind']


class ReportingManagerAppraisalTimerSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReportingManagerAppraisalTimer
        fields = ['reporting_manager_review_start', 'reporting_manager_review_end', 'reporting_manager_review_remind']


class ReviewerAppraisalTimerSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReviewerAppraisalTimer
        fields = ['reviewer_period_start', 'reviewer_period_end', 'reviewer_period_remind']


# --- Main Appraisal / Review Serializers ---

class EmployeeAppraisalSerializer(serializers.ModelSerializer):
    appraisal_period = EmployeeAppraisalTimerSerializer(read_only=True)

    class Meta:
        model = EmployeeAppraisal
        fields = '__all__'
        read_only_fields = ['appraisal_submitted_date', 'appraisal_period']


class AttendanceSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = AttendanceSummary
        fields = '__all__'


class SalaryRecommendationSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalaryVariance
        fields = '__all__'


class ReportingManagerReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReportingManagerReview
        fields = '__all__'


class HRReviewSerializer(serializers.ModelSerializer):
    attendance_summary = AttendanceSummarySerializer(read_only=True)
    salary_recommendation = SalaryRecommendationSerializer(read_only=True)

    class Meta:
        model = HRReview
        fields = '__all__'


class FinalReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = FinalReview
        fields = '__all__'
