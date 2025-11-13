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
from system.utils.serializers import SmartUpdateSerializer

class AppraisalValidatorMixin:

    def validate_appraisal_object(self, employee, reviewed_flag=True):

        if not employee:
            raise serializers.ValidationError("Invalid employee instance passed for appraisal.")
        
        if not reviewed_flag:
            raise serializers.ValidationError("Review not allowed as per employee's review hierarchy.")
        
        employee_appraisal_details = AppraisalDetails.objects.filter(employee=employee).first()
        if not employee_appraisal_details:
            raise serializers.ValidationError(f"Appraisal details not configured for {employee.name}.")

        if not (employee_appraisal_details.is_in_active_period()):
            raise serializers.ValidationError(
                f"Appraisal can only be created between employee's appraisal period."
            )


class EmployeeAppraisalSerializer(AppraisalValidatorMixin, SmartUpdateSerializer):
    class Meta:
        model = EmployeeAppraisal
        fields = '__all__'
        read_only_fields = ['id', 'updated_at', 'created_at']

    def validate(self, attrs):
        employee = attrs.get('employee')
        self.validate_appraisal_object(employee)
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



class ReportingManagerReviewSerializer(AppraisalValidatorMixin, SmartUpdateSerializer):

    class Meta:
        model = ReportingManagerReview
        fields = '__all__'
        read_only_fields = ['id', 'updated_at', 'created_at']

    def validate(self, attrs):
        appraisal = attrs.get('appraisal')
        if not appraisal:
            raise serializers.ValidationError(f"Appraisal not created.")
        self.validate_appraisal_object(appraisal.employee, appraisal.employee.reviewed_by_rm)
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



class HrReviewSerializer(AppraisalValidatorMixin, SmartUpdateSerializer):

    class Meta:
        model = HrReview
        fields = '__all__'
        read_only_fields = ['id', 'updated_at', 'created_at']

    def validate(self, attrs):
        appraisal = attrs.get('appraisal')
        if not appraisal:
            raise serializers.ValidationError("Appraisal not created.")
        self.validate_appraisal_object(appraisal.employee, appraisal.employee.reviewed_by_hr)
        return attrs
    
    def create(self, validated_data):
        review_instance = super().create(validated_data)
        employee = review_instance.appraisal.employee
        if not employee:
            raise serializers.ValidationError("Employee must be linked to this appraisal.")
        
        try:
            track, _ = EmployeeAppraisalStatus.objects.get_or_create(employee=employee)
            track.hr_review_done = 'DONE' 
            track.save()
        except Exception as e:
            print(f"Error updating hr_review_done status track after creation: {e}") 

        try:
            appraisal_details = AppraisalDetails.objects.filter(employee=employee).first()
            if not appraisal_details:
                raise serializers.ValidationError(f"Appraisal details not configured for {employee.name}.")
            appraisal_details.hr_review = review_instance
            appraisal_details.save()
        except Exception as e:
            print(f"Error adding hr_review relation in appraisal details: {e}") 

        return review_instance



class HodReviewSerializer(AppraisalValidatorMixin, SmartUpdateSerializer):

    class Meta:
        model = HodReview
        fields = '__all__'
        read_only_fields = ['id', 'updated_at', 'created_at']
    
    def validate(self, attrs):
        appraisal = attrs.get('appraisal')
        if not appraisal:
            raise serializers.ValidationError(f"Appraisal not created.")
        self.validate_appraisal_object(appraisal.employee, appraisal.employee.reviewed_by_hod)
        return attrs
    
    def create(self, validated_data):
        review_instance = super().create(validated_data)
        
        try:
            employee = review_instance.appraisal.employee
            track, _ = EmployeeAppraisalStatus.objects.get_or_create(employee=employee)
            track.hod_review_done = 'DONE' 
            track.save()
        except Exception as e:
            print(f"Error updating hod_review_done status track after creation: {e}") 
        
        try:
            appraisal_details = AppraisalDetails.objects.filter(employee=employee).first()
            if not appraisal_details:
                raise serializers.ValidationError(f"Appraisal details not configured for {employee.name}.")
            appraisal_details.hod_review = review_instance
            appraisal_details.save()
        except Exception as e:
            print(f"Error adding hod_review relation in appraisal details: {e}") 

        return review_instance



class CooReviewSerializer(AppraisalValidatorMixin, SmartUpdateSerializer):

    class Meta:
        model = CooReview
        fields = '__all__'
        read_only_fields = ['id', 'updated_at', 'created_at']

    def validate(self, attrs):
        appraisal = attrs.get('appraisal')
        if not appraisal:
            raise serializers.ValidationError(f"Appraisal not created.")
        self.validate_appraisal_object(appraisal.employee, appraisal.employee.reviewed_by_coo)
        return attrs
    
    def create(self, validated_data):
        review_instance = super().create(validated_data)

        try:
            employee = review_instance.appraisal.employee
            track, _ = EmployeeAppraisalStatus.objects.get_or_create(employee=employee)
            track.coo_review_done = 'DONE' 
            track.save()
        except Exception as e:
            print(f"Error updating coo_review_done status track after creation: {e}") 

        try:
            appraisal_details = AppraisalDetails.objects.filter(employee=employee).first()
            if not appraisal_details:
                raise serializers.ValidationError(f"Appraisal details not configured for {employee.name}.")
            appraisal_details.coo_review = review_instance
            appraisal_details.save()
        except Exception as e:
            print(f"Error adding coo_review relation in appraisal details: {e}") 

        return review_instance



class CeoReviewSerializer(AppraisalValidatorMixin, SmartUpdateSerializer):

    class Meta:
        model = CeoReview
        fields = '__all__'
        read_only_fields = ['id', 'updated_at', 'created_at']

    def validate(self, attrs):
        appraisal = attrs.get('appraisal')
        if not appraisal:
            raise serializers.ValidationError(f"Appraisal not created.")
        self.validate_appraisal_object(appraisal.employee, appraisal.employee.reviewed_by_ceo)
        return attrs
    
    def create(self, validated_data):
        review_instance = super().create(validated_data)
        
        try:
            employee = review_instance.appraisal.employee
            track, _ = EmployeeAppraisalStatus.objects.get_or_create(employee=employee)
            track.ceo_review_done = 'DONE'
            track.save()
        except Exception as e:
            print(f"Error updating ceo_review_done status track after creation: {e}") 

        try:
            appraisal_details = AppraisalDetails.objects.filter(employee=employee).first()
            if not appraisal_details:
                raise serializers.ValidationError(f"Appraisal details not configured for {employee.name}.")
            appraisal_details.ceo_review = review_instance
            appraisal_details.save()
        except Exception as e:
            print(f"Error adding ceo_review relation in appraisal details: {e}") 

        return review_instance



# --- AppraisalDetails Serializer ---

class AppraisalDetailsSerializer(serializers.ModelSerializer):

    emp_id = serializers.CharField(source='employee.id', read_only=True)
    emp_name = serializers.CharField(source='employee.name', read_only=True)
    emp_dept = serializers.SerializerMethodField()
    emp_grade = serializers.SerializerMethodField()
    emp_des = serializers.SerializerMethodField()
    emp_join = serializers.DateField(source='employee.joining_date', read_only=True)
    emp_basic_salary = serializers.IntegerField(source='employee.basic_salary', read_only=True)
    active_status = serializers.BooleanField(source='is_in_active_period', read_only=True)

    def get_emp_dept(self, obj):
        return obj.employee.department.name if obj.employee.department else None

    def get_emp_grade(self, obj):
        return obj.employee.grade.name if obj.employee.grade else None

    def get_emp_des(self, obj):
        return obj.employee.designation.name if obj.employee.designation else None

    class Meta:
        model = AppraisalDetails
        fields = [
            "emp_id", "emp_name", "emp_dept", "emp_grade", "emp_des", "emp_join", "emp_basic_salary",
            "emp_appraisal", "reporting_manager", "rm_review", "hr_review", "hod_review", "coo_review", "ceo_review",
            "appraisal_start_date", "appraisal_end_date", "factor", "active_status", "appraisal_status"
        ]
        read_only_fields = [
            "emp_id", "emp_name", "emp_dept", "emp_grade", "emp_des", "emp_join", "emp_basic_salary",
            "emp_appraisal", "reporting_manager", "rm_review", "hr_review", "hod_review", "coo_review", "ceo_review",
            "factor", "active_status", "appraisal_status"
        ]



# --- Tracking Serializers ---

class EmployeeAppraisalStatusSerializer(serializers.ModelSerializer):

    emp_id = serializers.CharField(source='employee.id', read_only=True)
    emp_name = serializers.CharField(source='employee.name', read_only=True)
    
    class Meta:
        model = EmployeeAppraisalStatus
        fields = '__all__'
        read_only_fields = ['id']

