from rest_framework import serializers
from .models import (
    EmployeeAppraisal,
    ReportingManagerReview,
    HrReview,
    HodReview,
    CooReview,
    CeoReview,
    EmployeeAppraisalStatus,
    AppraisalDetails,
)

class AppraisalValidatorMixin:

    def validate_appraisal(self, employee, reviewed_flag=True):

        if not employee:
            raise serializers.ValidationError("Employee must be specified for appraisal.")
        
        if not reviewed_flag:
            raise serializers.ValidationError("Review not allowed as per employee's review hierarchy.")
        
        employee_appraisal_details = AppraisalDetails.objects.filter(employee=employee).first()
        if not employee_appraisal_details:
            raise serializers.ValidationError(f"Appraisal details not configured for {employee.name}.")

        if not (employee_appraisal_details.is_in_active_period()):
            raise serializers.ValidationError(
                f"Appraisal can only be created between employee's appraisal period."
            )


class EmployeeAppraisalSerializer(AppraisalValidatorMixin, serializers.ModelSerializer):
    class Meta:
        model = EmployeeAppraisal
        fields = '__all__'
        read_only_fields = ['id', 'updated_at', 'created_at']

    def validate(self, attrs):
        employee = attrs.get('employee')
        self.validate_appraisal(employee)
        return attrs
        
    def create(self, validated_data):
        appraisal_instance = super().create(validated_data)
        
        try:
            employee = appraisal_instance.employee
            track, _ = EmployeeAppraisalStatus.objects.get_or_create(employee=employee)
            track.self_appraisal_done = 'DONE'
            track.save() 
        except Exception as e:
            print(f"Error updating self_appraisal_done status track after creation: {e}") 

        try:
            appraisal_details = AppraisalDetails.objects.filter(employee=employee).first()
            if not appraisal_details:
                raise serializers.ValidationError(f"Appraisal details not configured for {employee.name}.")
            appraisal_details.emp_appraisal = appraisal_instance
            appraisal_details.save()
        except Exception as e:
            print(f"Error adding emp_appraisal relation in appraisal details: {e}") 

        return appraisal_instance



class ReportingManagerReviewSerializer(AppraisalValidatorMixin, serializers.ModelSerializer):

    class Meta:
        model = ReportingManagerReview
        fields = '__all__'
        read_only_fields = ['id', 'updated_at', 'created_at']

    def validate(self, attrs):
        appraisal = attrs.get('appraisal')
        if not appraisal:
            raise serializers.ValidationError(f"Appraisal not created.")
        self.validate_appraisal(appraisal.employee, appraisal.employee.reviewed_by_rm)
        return attrs
    
    def create(self, validated_data):
        review_instance = super().create(validated_data)

        try:
            employee = review_instance.appraisal.employee
            track, _ = EmployeeAppraisalStatus.objects.get_or_create(employee=employee)
            track.rm_review_done = 'DONE' 
            track.save()
        except Exception as e:
            print(f"Error updating rm_review_done status track after creation: {e}") 

        try:
            appraisal_details = AppraisalDetails.objects.filter(employee=employee).first()
            if not appraisal_details:
                raise serializers.ValidationError(f"Appraisal details not configured for {employee.name}.")
            appraisal_details.rm_review = review_instance
            appraisal_details.save()
        except Exception as e:
            print(f"Error adding rm_review relation in appraisal details: {e}") 

        return review_instance



class HrReviewSerializer(AppraisalValidatorMixin, serializers.ModelSerializer):

    class Meta:
        model = HrReview
        fields = '__all__'
        read_only_fields = ['id', 'updated_at', 'created_at']

    def validate(self, attrs):
        appraisal = attrs.get('appraisal')
        if not appraisal:
            raise serializers.ValidationError(f"Appraisal not created.")
        self.validate_appraisal(appraisal.employee, appraisal.employee.reviewed_by_hr)
        return attrs
    
    def create(self, validated_data):
        review_instance = super().create(validated_data)
        
        try:
            employee = review_instance.appraisal.employee
            track, _ = EmployeeAppraisalStatus.objects.get_or_create(employee=employee)
            track.hr_review_done = 'DONE' 
            track.save()
        except Exception as e:
            print(f"Error updating rm_review_done status track after creation: {e}") 

        try:
            appraisal_details = AppraisalDetails.objects.filter(employee=employee).first()
            if not appraisal_details:
                raise serializers.ValidationError(f"Appraisal details not configured for {employee.name}.")
            appraisal_details.hr_review = review_instance
            appraisal_details.save()
        except Exception as e:
            print(f"Error adding hr_review relation in appraisal details: {e}") 

        return review_instance



class HodReviewSerializer(AppraisalValidatorMixin, serializers.ModelSerializer):

    class Meta:
        model = HodReview
        fields = '__all__'
        read_only_fields = ['id', 'updated_at', 'created_at']
    
    def validate(self, attrs):
        appraisal = attrs.get('appraisal')
        if not appraisal:
            raise serializers.ValidationError(f"Appraisal not created.")
        self.validate_appraisal(appraisal.employee, appraisal.employee.reviewed_by_hod)
        return attrs
    
    def create(self, validated_data):
        review_instance = super().create(validated_data)
        
        try:
            employee = review_instance.appraisal.employee
            track, _ = EmployeeAppraisalStatus.objects.get_or_create(employee=employee)
            track.hod_review_done = 'DONE' 
            track.save()
        except Exception as e:
            print(f"Error updating rm_review_done status track after creation: {e}") 
        
        try:
            appraisal_details = AppraisalDetails.objects.filter(employee=employee).first()
            if not appraisal_details:
                raise serializers.ValidationError(f"Appraisal details not configured for {employee.name}.")
            appraisal_details.hod_review = review_instance
            appraisal_details.save()
        except Exception as e:
            print(f"Error adding hod_review relation in appraisal details: {e}") 

        return review_instance



class CooReviewSerializer(AppraisalValidatorMixin, serializers.ModelSerializer):

    class Meta:
        model = CooReview
        fields = '__all__'
        read_only_fields = ['id', 'updated_at', 'created_at']

    def validate(self, attrs):
        appraisal = attrs.get('appraisal')
        if not appraisal:
            raise serializers.ValidationError(f"Appraisal not created.")
        self.validate_appraisal(appraisal.employee, appraisal.employee.reviewed_by_coo)
        return attrs
    
    def create(self, validated_data):
        review_instance = super().create(validated_data)

        try:
            employee = review_instance.appraisal.employee
            track, _ = EmployeeAppraisalStatus.objects.get_or_create(employee=employee)
            track.coo_review_done = 'DONE' 
            track.save()
        except Exception as e:
            print(f"Error updating rm_review_done status track after creation: {e}") 

        try:
            appraisal_details = AppraisalDetails.objects.filter(employee=employee).first()
            if not appraisal_details:
                raise serializers.ValidationError(f"Appraisal details not configured for {employee.name}.")
            appraisal_details.coo_review = review_instance
            appraisal_details.save()
        except Exception as e:
            print(f"Error adding hod_review relation in appraisal details: {e}") 

        return review_instance



class CeoReviewSerializer(AppraisalValidatorMixin, serializers.ModelSerializer):

    class Meta:
        model = CeoReview
        fields = '__all__'
        read_only_fields = ['id', 'updated_at', 'created_at']

    def validate(self, attrs):
        appraisal = attrs.get('appraisal')
        if not appraisal:
            raise serializers.ValidationError(f"Appraisal not created.")
        self.validate_appraisal(appraisal.employee, appraisal.employee.reviewed_by_ceo)
        return attrs
    
    def create(self, validated_data):
        review_instance = super().create(validated_data)
        
        try:
            employee = review_instance.appraisal.employee
            track, _ = EmployeeAppraisalStatus.objects.get_or_create(employee=employee)
            track.ceo_review_done = 'DONE'
            track.save()
        except Exception as e:
            print(f"Error updating rm_review_done status track after creation: {e}") 

        try:
            appraisal_details = AppraisalDetails.objects.filter(employee=employee).first()
            if not appraisal_details:
                raise serializers.ValidationError(f"Appraisal details not configured for {employee.name}.")
            appraisal_details.ceo_review = review_instance
            appraisal_details.save()
        except Exception as e:
            print(f"Error adding hod_review relation in appraisal details: {e}") 

        return review_instance



# --- AppraisalDetails Serializer ---

class AppraisalDetailsSerializer(serializers.ModelSerializer):

    emp_id = serializers.CharField(source='employee.id', read_only=True)
    emp_name = serializers.CharField(source='employee.name', read_only=True)
    emp_dept = serializers.CharField(source='employee.department.name', read_only=True)
    emp_grade = serializers.CharField(source='employee.grade.name', read_only=True)
    emp_des = serializers.CharField(source='employee.designation.name', read_only=True)
    emp_join = serializers.DateField(source='employee.joining_date', read_only=True)
    emp_basic_salary = serializers.DecimalField(source='employee.basic_salary', read_only=True, max_digits=10, decimal_places=2)

    class Meta:
        model = AppraisalDetails
        fields = [
            "emp_id", "emp_name", "emp_dept", "emp_grade", "emp_des", "emp_join", "emp_basic_salary",
            "emp_appraisal", "rm_review", "hr_review", "hod_review", "coo_review", "ceo_review",
            "appraisal_start_date", "appraisal_end_date"
        ]
        read_only_fields = [
            "emp_id", "emp_name", "emp_dept", "emp_grade", "emp_des", "emp_join", "emp_basic_salary",
            "emp_appraisal", "rm_review", "hr_review", "hod_review", "coo_review", "ceo_review"
        ]



# --- Tracking Serializers ---

class EmployeeAppraisalStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeAppraisalStatus
        fields = '__all__'
        read_only_fields = ['id']

