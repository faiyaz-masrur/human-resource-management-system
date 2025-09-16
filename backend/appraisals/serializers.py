from rest_framework import serializers
from .models import (
    EmployeeAppraisalTimer,
    ReportingManagerAppraisalTimer,
    FinalReviewerAppraisalTimer,
    EmployeeAppraisal,
    ReportingManagerReview,
    AttendanceSummary,
    SalaryVariance,
    HRReview,
    FinalReview,
    EmployeeAppraisalTrack,
    ReportingManagerAppraisalTrack,
)


# --- Timer Serializers ---

class EmployeeAppraisalTimerSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeAppraisalTimer
        fields = ['employee_self_appraisal_start', 'employee_self_appraisal_end', 'employee_self_appraisal_remind']


class ReportingManagerAppraisalTimerSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReportingManagerAppraisalTimer
        fields = ['reporting_manager_review_start', 'reporting_manager_review_end', 'reporting_manager_review_remind']


class FinalReviewerAppraisalTimerSerializer(serializers.ModelSerializer):
    class Meta:
        model = FinalReviewerAppraisalTimer
        fields = ['final_review_start', 'final_review_end', 'final_review_remind']


# --- Main Appraisal / Review Serializers ---

class EmployeeAppraisalSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeAppraisal
        fields = '__all__'
        read_only_fields = ['submission_date']


class AttendanceSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = AttendanceSummary
        fields = '__all__'


class SalaryVarianceSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalaryVariance
        fields = '__all__'


class ReportingManagerReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReportingManagerReview
        fields = '__all__'
        read_only_fields = ['submission_date']


class HRReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = HRReview
        fields = '__all__'
        read_only_fields = ['submission_date']


class FinalReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = FinalReview
        fields = '__all__'
        read_only_fields = ['submission_date']


# --- Tracking Serializers ---

class EmployeeAppraisalTrackSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeAppraisalTrack
        fields = '__all__'
        read_only_fields = ['last_updated']


class ReportingManagerAppraisalTrackSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReportingManagerAppraisalTrack
        fields = '__all__'
        read_only_fields = ['updated_at']
