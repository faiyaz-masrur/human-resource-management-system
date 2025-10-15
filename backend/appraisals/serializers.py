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
    class Meta:
        model = EmployeeAppraisal
        # --- FIX: MUST use an explicit list/tuple instead of '__all__' (which is a string) 
        # for proper inheritance concatenation in EmployeeAppraisalDetailSerializer.
        # IMPORTANT: You must ensure this list contains ALL the direct fields from 
        # your EmployeeAppraisal model that you wish to expose.
        fields = [
            'id', 
            'employee', # Assuming this is a field
            'reviewer', # Assuming this is a field
            'status',
            'appraisal_month_year',
            # Add ALL other fields from your EmployeeAppraisal model here, e.g.:
            # 'goals', 'self_rating', 'comments', 'submission_date', etc.
        ]
        # Explicitly setting all auto-fields as read-only for security
        read_only_fields = ['id', 'appraisal_month_year']
        
    def create(self, validated_data):

        # 1. First, call the parent class's create method to save the new appraisal instance.
        appraisal_instance = super().create(validated_data)
        employee = appraisal_instance.employee

        try:
            # 2. Get the corresponding status track instance for the employee.
            # get_or_create is used to ensure the track exists for this employee.
            track, _ = EmployeeAppraisalStatusTrack.objects.get_or_create(employee=employee)
            
            track.self_appraisal_done = True
            
            track.save()
            
        except Exception as e:

            print(f"Error updating self_appraisal_done status track after creation: {e}") 

        return appraisal_instance


class ReportingManagerReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReportingManagerReview
        fields = '__all__'
        read_only_fields = ['id', 'appraisal', 'reviewer']

    def create(self, validated_data):

        review_instance = super().create(validated_data)
        
        try:

            employee = review_instance.appraisal.employee

            track, _ = EmployeeAppraisalStatusTrack.objects.get_or_create(employee=employee)

            track.rm_review_done = True 
            track.save()
            
        except AttributeError:

            print(f"Warning: Cannot update status track. Missing 'appraisal' or 'employee' relation on ReportingManagerReview.")
        except Exception as e:
            
            print(f"Error updating rm_review_done status track after creation: {e}") 

        return review_instance


class HRReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = HrReview
        fields = '__all__'
        read_only_fields = ['id', 'appraisal', 'reviewer']
    
    def create(self, validated_data):

        review_instance = super().create(validated_data)
        
        try:

            employee = review_instance.appraisal.employee

            track, _ = EmployeeAppraisalStatusTrack.objects.get_or_create(employee=employee)

            track.hr_review_done = True 
            track.save()
            
        except AttributeError:

            print(f"Warning: Cannot update status track. Missing 'appraisal' or 'employee' relation on HRReview.")
        except Exception as e:
            
            print(f"Error updating rm_review_done status track after creation: {e}") 

        return review_instance


class HODReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = HodReview
        fields = '__all__'
        read_only_fields = ['id', 'appraisal', 'reviewer']
    
    def create(self, validated_data):

        review_instance = super().create(validated_data)
        
        try:

            employee = review_instance.appraisal.employee

            track, _ = EmployeeAppraisalStatusTrack.objects.get_or_create(employee=employee)

            track.hod_review_done = True 
            track.save()
            
        except AttributeError:

            print(f"Warning: Cannot update status track. Missing 'appraisal' or 'employee' relation on HODReview.")
        except Exception as e:
            
            print(f"Error updating rm_review_done status track after creation: {e}") 

        return review_instance

class COOReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = CooReview
        fields = '__all__'
        read_only_fields = ['id', 'appraisal', 'reviewer']
        
    def create(self, validated_data):

        review_instance = super().create(validated_data)
        
        try:

            employee = review_instance.appraisal.employee

            track, _ = EmployeeAppraisalStatusTrack.objects.get_or_create(employee=employee)

            track.coo_review_done = True 
            track.save()
            
        except AttributeError:

            print(f"Warning: Cannot update status track. Missing 'appraisal' or 'employee' relation on CooReview.")
        except Exception as e:
            
            print(f"Error updating rm_review_done status track after creation: {e}") 

        return review_instance

class CEOReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = CeoReview
        fields = '__all__'
        read_only_fields = ['id', 'appraisal', 'reviewer']
    
    def create(self, validated_data):

        review_instance = super().create(validated_data)
        
        try:

            employee = review_instance.appraisal.employee

            track, _ = EmployeeAppraisalStatusTrack.objects.get_or_create(employee=employee)

            track.ceo_review_done = True
            track.save()
            
        except AttributeError:

            print(f"Warning: Cannot update status track. Missing 'appraisal' or 'employee' relation on CeoReview.")
        except Exception as e:
            
            print(f"Error updating rm_review_done status track after creation: {e}") 

        return review_instance


# --- Tracking Serializers ---

class EmployeeAppraisalStatusTrackSerializer(serializers.ModelSerializer):
    """Tracks the status and history of an employee's appraisal process."""
    class Meta:
        model = EmployeeAppraisalStatusTrack
        fields = '__all__'
        read_only_fields = ['id']

class ReportingManagerAppraisalTrackSerializer(serializers.ModelSerializer):
    """Tracks the status and history of the reporting manager's review phase."""
    class Meta:
        model = ReportingManagerAppraisalTrack
        fields = '__all__'
        read_only_fields = ['id', 'updated_at', 'created_at']


# --- Comprehensive Detail/Read Serializer (Nesting Example) ---

class EmployeeAppraisalDetailSerializer(EmployeeAppraisalSerializer):

    # Nested fields definitions
    attendance_summary = AttendanceSummarySerializer(read_only=True) 
    salary_variance = SalaryRecommendationSerializer(read_only=True)     
    rm_review = ReportingManagerReviewSerializer(read_only=True) 
    hr_review = HRReviewSerializer(read_only=True)                 
    hod_review = HODReviewSerializer(read_only=True)
    coo_review = COOReviewSerializer(read_only=True)
    ceo_review = CEOReviewSerializer(read_only=True)         

    class Meta(EmployeeAppraisalSerializer.Meta):

        # FIX: The parent's fields attribute is now a list, allowing concatenation.
        # FIX: Changed 'salary_recommendation' to 'salary_variance' to match the attribute name above.
        fields = EmployeeAppraisalSerializer.Meta.fields + [
            'attendance_summary', 
            'salary_variance', 
            'rm_review', 
            'hr_review', 
            'hod_review', 
            'coo_review', 
            'ceo_review'
        ]
        
        read_only_fields = EmployeeAppraisalSerializer.Meta.read_only_fields
