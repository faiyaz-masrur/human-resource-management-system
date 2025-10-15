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
    AppraisalDetails,
    AllAppraisalRecord
)


# --- Nested Serializers for Related Data (Attendance, Salary) ---

class AttendanceSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = AttendanceSummary
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class SalaryRecommendationSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalaryRecommendation
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


# --- Timer Serializers ---

class EmployeeAppraisalTimerSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeAppraisalTimer
        fields = '__all__'
        read_only_fields = ['id']


class ReportingManagerAppraisalTimerSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReportingManagerAppraisalTimer
        fields = '__all__'
        read_only_fields = ['id']


class FinalReviewerAppraisalTimerSerializer(serializers.ModelSerializer):
    class Meta:
        model = FinalReviewerAppraisalTimer
        fields = '__all__'
        read_only_fields = ['id']


# --- Review/Appraisal Serializers ---

class EmployeeAppraisalSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeAppraisal
        fields = '__all__'
        read_only_fields = ['appraisal_id','appraisal_period', 'updated_at', 'created_at']
        
        def create(self, validated_data):

            # 1. First, call the parent class's create method to save the new appraisal instance.
            appraisal_instance = super().create(validated_data)
            employee = appraisal_instance.employee

            try:
                # 2. Get the corresponding status track instance for the employee.
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
        read_only_fields = ['id', 'appraisal', 'reviewer', 'appraisal_period', 'updated_at', 'created_at']
    
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
        read_only_fields = ['id', 'appraisal', 'reviewer', 'appraisal_period', 'updated_at', 'created_at']
    
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
        read_only_fields = ['id', 'appraisal', 'reviewer', 'appraisal_period', 'updated_at', 'created_at']
    
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
        read_only_fields = ['id', 'appraisal', 'reviewer', 'appraisal_period', 'updated_at', 'created_at']
    
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
        read_only_fields = ['id', 'appraisal', 'reviewer', 'appraisal_period', 'updated_at', 'created_at']
    
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
    class Meta:
        model = EmployeeAppraisalStatusTrack
        fields = '__all__'
        read_only_fields = ['id']


class ReportingManagerAppraisalTrackSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReportingManagerAppraisalTrack
        fields = '__all__'
        read_only_fields = ['id']


# --- AppraisalDetails Serializer ---

class AppraisalDetailsSerializer(serializers.ModelSerializer):
    emp_appraisal = EmployeeAppraisalSerializer(read_only=True)
    rm_review = ReportingManagerReviewSerializer(read_only=True)
    hr_review = HRReviewSerializer(read_only=True)
    hod_review = HODReviewSerializer(read_only=True)
    coo_review = COOReviewSerializer(read_only=True)
    ceo_review = CEOReviewSerializer(read_only=True)

    class Meta:
        model = AppraisalDetails
        fields = '__all__'
        read_only_fields = ['id', 'appraisal_period', 'updated_at', 'created_at']


# --- AllAppraisal Serializer ---

class AllAppraisalRecordSerializer(serializers.ModelSerializer):
    emp_appraisal = EmployeeAppraisalSerializer(read_only=True)
    rm_review = ReportingManagerReviewSerializer(read_only=True)
    hr_review = HRReviewSerializer(read_only=True)
    hod_review = HODReviewSerializer(read_only=True)
    coo_review = COOReviewSerializer(read_only=True)
    ceo_review = CEOReviewSerializer(read_only=True)

    class Meta:
        model = AllAppraisalRecord
        fields = '__all__'
        read_only_fields = ['id', 'appraisal_period', 'updated_at', 'created_at']
