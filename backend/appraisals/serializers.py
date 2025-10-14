from rest_framework import serializers
from .models import (
    EmployeeAppraisalTimer,
    ReportingManagerAppraisalTimer,
    FinalReviewerAppraisalTimer,
    EmployeeAppraisal,
    ReportingManagerReview,
    AttendanceSummary,
    SalaryRecommendation,
    HrReview,
    HodReview,   
    CooReview,   
    CeoReview,
    EmployeeAppraisalStatusTrack,
    ReportingManagerAppraisalTrack,
)


# --- Nested Serializers for Related Data (Attendance, Salary) ---

class AttendanceSummarySerializer(serializers.ModelSerializer):
    """Serializer for the employee's attendance summary data (usually read-only)."""
    class Meta:
        model = AttendanceSummary
        fields = '__all__'
        # Ensure all system-managed fields are read-only
        read_only_fields = ['id', 'created_at', 'updated_at'] 


class SalaryRecommendationSerializer(serializers.ModelSerializer):
    """Serializer for the employee's salary variance data (usually read-only)."""
    class Meta:
        model = SalaryRecommendation
        fields = '__all__'
        # Ensure all system-managed fields are read-only
        read_only_fields = ['id', 'created_at', 'updated_at']


# --- Timer Serializers ---

class EmployeeAppraisalTimerSerializer(serializers.ModelSerializer):
    """Timer for the Employee's phase."""
    class Meta:
        model = EmployeeAppraisalTimer
        fields = '__all__'
        read_only_fields = ['id']


class ReportingManagerAppraisalTimerSerializer(serializers.ModelSerializer):
    """Timer for the Reporting Manager's phase."""
    class Meta:
        model = ReportingManagerAppraisalTimer
        fields = '__all__'
        read_only_fields = ['id']


class FinalReviewerAppraisalTimerSerializer(serializers.ModelSerializer):
    """Timer for the Final Reviewer's phase."""
    class Meta:
        model = FinalReviewerAppraisalTimer
        fields = '__all__'
        read_only_fields = ['id']


# --- Review/Appraisal Serializers (Write/Update Focused) ---

class EmployeeAppraisalSerializer(serializers.ModelSerializer):
    """Serializer for the initial Employee Appraisal form submission."""
    class Meta:
        model = EmployeeAppraisal
        fields = '__all__'
        # Explicitly setting all auto-fields as read-only for security
        read_only_fields = ['id', 'submission_date', 'created_at', 'updated_at']


class ReportingManagerReviewSerializer(serializers.ModelSerializer):
    """Serializer for the Reporting Manager's review."""
    class Meta:
        model = ReportingManagerReview
        fields = '__all__'
        read_only_fields = ['id', 'submission_date', 'created_at', 'updated_at']


class HRReviewSerializer(serializers.ModelSerializer):
    """Serializer for the HR Review stage."""
    class Meta:
        model = HrReview
        fields = '__all__'
        read_only_fields = ['id', 'submission_date', 'created_at', 'updated_at']


# --- Granular Final Review Serializers ---

class HODReviewSerializer(serializers.ModelSerializer):
    """Serializer for the Head of Department (HOD) Review stage."""
    class Meta:
        model = HodReview
        fields = '__all__'
        read_only_fields = ['id', 'submission_date', 'created_at', 'updated_at']

class COOReviewSerializer(serializers.ModelSerializer):
    """Serializer for the Chief Operating Officer (COO) Review stage."""
    class Meta:
        model = CooReview
        fields = '__all__'
        read_only_fields = ['id', 'submission_date', 'created_at', 'updated_at']

class CEOReviewSerializer(serializers.ModelSerializer):
    """Serializer for the Chief Executive Officer (CEO) Review stage."""
    class Meta:
        model = CeoReview
        fields = '__all__'
        read_only_fields = ['id', 'submission_date', 'created_at', 'updated_at']


# --- Tracking Serializers ---

class EmployeeAppraisalStatusTrackSerializer(serializers.ModelSerializer):
    """Tracks the status and history of an employee's appraisal process."""
    class Meta:
        model = EmployeeAppraisalStatusTrack
        fields = '__all__'
        read_only_fields = ['id', 'last_updated', 'created_at']


class ReportingManagerAppraisalTrackSerializer(serializers.ModelSerializer):
    """Tracks the status and history of the reporting manager's review phase."""
    class Meta:
        model = ReportingManagerAppraisalTrack
        fields = '__all__'
        read_only_fields = ['id', 'updated_at', 'created_at']


# --- Comprehensive Detail/Read Serializer (Nesting Example) ---

class EmployeeAppraisalDetailSerializer(EmployeeAppraisalSerializer):
    """
    A detailed read-only serializer for a complete appraisal view,
    nesting all related review and data objects for easy fetching on detail pages.
    """
    attendance_summary = AttendanceSummarySerializer(read_only=True) 
    salary_variance = SalaryRecommendationSerializer(read_only=True)       
    rm_review = ReportingManagerReviewSerializer(read_only=True) 
    hr_review = HRReviewSerializer(read_only=True)                   
    hod_review = HODReviewSerializer(read_only=True)
    coo_review = COOReviewSerializer(read_only=True)
    ceo_review = CEOReviewSerializer(read_only=True)             

    class Meta(EmployeeAppraisalSerializer.Meta):

        fields = EmployeeAppraisalSerializer.Meta.fields + [
            'attendance_summary', 
            'salary_recommendation', 
            'rm_review', 
            'hr_review', 
            'hod_review', 
            'coo_review', 
            'ceo_review'
        ]
        
        read_only_fields = EmployeeAppraisalSerializer.Meta.read_only_fields
