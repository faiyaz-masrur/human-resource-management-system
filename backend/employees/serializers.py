from rest_framework import serializers
from .models import WorkExperience, Education, TrainingCertificate, PersonalDetail, Address, Attatchment
from django.core.mail import send_mail
from django.utils.crypto import get_random_string
from django.conf import settings
from system.models import Employee, RolePermission, ReportingManager
from system.utils.serializers import SmartUpdateSerializer
from django.db import transaction


class AddressSerializer(SmartUpdateSerializer):
    class Meta:
        model = Address
        fields = "__all__"
        read_only_fields = ("employee",)


class WorkExperienceSerializer(SmartUpdateSerializer):
    class Meta:
        model = WorkExperience
        fields = "__all__"
        read_only_fields = ("employee","id",)

class EducationSerializer(SmartUpdateSerializer):
    class Meta:
        model = Education
        fields = "__all__"
        read_only_fields = ("employee","id",)

    
class TrainingCertificateSerializer(SmartUpdateSerializer):
    class Meta:
        model = TrainingCertificate
        fields = "__all__"
        read_only_fields = ("employee",)


class AttatchmentSerializer(SmartUpdateSerializer):
    class Meta:
        model = Attatchment
        fields = "__all__"
        read_only_fields = ("employee",)


class EmployeeListSerializer(serializers.ModelSerializer):
    department = serializers.CharField(source="department.name", read_only=True)
    designation = serializers.CharField(source="designation.name", read_only=True)
    
    class Meta:
        model = Employee
        fields = ["id", "email", "name", "department", "designation", "is_active"]
        read_only_fields = fields


class EmployeeOfficialDetailSerializer(SmartUpdateSerializer):

    class Meta:
        model = Employee
        fields = [
            "id", "name", "email",
            "joining_date", "basic_salary",
            "department", "designation", "grade",
            "reporting_manager", "role", "is_active",
            "reviewed_by_rm", "reviewed_by_hr", "reviewed_by_hod", "reviewed_by_coo", "reviewed_by_ceo",
        ]

    def validate_email(self, value):
        if not value.endswith("@sonaliintellect.com"):
            raise serializers.ValidationError(
                "Email must be a valid Sonali Intellect address (example@sonaliintellect.com)."
            )
        return value
    
    def create(self, validated_data):
        email = validated_data.get("email")
        raw_password = validated_data.pop("raw_password", None) or get_random_string(8)
        
        try:
            with transaction.atomic():
                employee = Employee.objects.create_user(
                    password=raw_password,
                    **validated_data
                )

                try:
                    employee_rm_review_permission = RolePermission.objects.get(
                        role=employee.role, 
                        workspace='ReviewAppraisal',
                        sub_workspace="EmployeeRmReview"
                    )

                    if employee_rm_review_permission.create or employee_rm_review_permission.edit:
                        ReportingManager.objects.get_or_create(manager=employee)
                        
                except RolePermission.DoesNotExist:
                    print(f"No RolePermission found for role {employee.role}")


                WorkExperience.objects.create(
                    employee=employee,
                    organization="Sonali Intellect Limited",
                    designation= employee.designation.name if employee.designation else "",
                    department= employee.department.name if employee.department else "",
                    start_date= employee.joining_date,
                    end_date=None,
                )

                # Email credentials
                email_subject = "Welcome to Sonali Intellect Limited! Your Account Credentials"

                email_message = (
                    f"Hello {employee.name},\n\n"
                    f"Welcome to Sonali Intellect Limited!\n\n"
                    f"As part of Sonali Intellect Limited’s initiative to automate employee profiles, your employee account has been created.\n\n"
                    f"Your login details:\n\n"
                    f"• Email: {email}\n"
                    f"• Temporary Password: {raw_password}\n\n"
                    f"Please log in at {settings.LOGIN_URL} and update your password immediately.\n\n"
                    f"This is an automated message. For any assistance, please contact your HR representative.\n\n"
                    f"Thank you,\n"
                    f"Sonali Intellect Limited,\n" 
                    f"HR Team"
                )

                send_mail(
                    subject=email_subject,
                    message=email_message,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[email],
                    fail_silently=True,
                )

                return employee
            
        except Exception as e:
            raise serializers.ValidationError(f"Error creating employee: {str(e)}")
        
    def update(self, instance, validated_data):
        """
        Override update to handle dynamic reporting manager updates
        based on role permission changes.
        """
        old_role = instance.role
        instance = super().update(instance, validated_data)
        new_role = instance.role

        # Only process if role actually changed
        if old_role != new_role:
            try:
                permission = RolePermission.objects.get(
                    role=new_role,
                    workspace='ReviewAppraisal',
                    sub_workspace='EmployeeRmReview'
                )

                has_permission = permission.create or permission.edit
                is_reporting_manager = ReportingManager.objects.filter(manager=instance).exists()

                if has_permission and not is_reporting_manager:
                    # Add as reporting manager
                    ReportingManager.objects.create(manager=instance)

                elif not has_permission and is_reporting_manager:
                    # Remove from reporting manager
                    ReportingManager.objects.filter(manager=instance).delete()

            except RolePermission.DoesNotExist:
                # If permission not found, ensure user is not a reporting manager
                ReportingManager.objects.filter(manager=instance).delete()

        return instance


class EmployeePersonalDetailSerializer(SmartUpdateSerializer):
    employee_name = serializers.CharField(source='employee.name', read_only=True)

    class Meta:
        model = PersonalDetail
        fields = [
            "employee_name",
            "id", "father_name", "mother_name", "phone_number", "personal_email",
            "date_of_birth", "national_id", "passport_number","blood_group", 
            "marital_status", "spouse_name", "spouse_nid",
            "emergency_contact_name", "emergency_contact_relationship", "emergency_contact_number",
        ]
    
    def to_representation(self, instance):
        data = super().to_representation(instance)

        employee = getattr(instance, "employee", None) or getattr(self.context.get("view").request, "_employee_instance", None)
        if employee:
            data["employee_name"] = employee.name

        return data







