from rest_framework import serializers
from .models import (
    EmployeeAppraisal,
    AttendanceSummary,
    SalaryRecommendation,
    ReportingManagerReview,
    HRReview,
    FinalReview
)

class EmployeeAppraisalSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeAppraisal
        fields = '__all__'

class AttendanceSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = AttendanceSummary
        fields = '__all__'

class SalaryRecommendationSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalaryRecommendation
        fields = '__all__'

class ReportingManagerReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReportingManagerReview
        fields = '__all__'

class HRReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = HRReview
        fields = '__all__'

class FinalReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = FinalReview
        fields = '__all__'
