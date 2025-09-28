from rest_framework import serializers
from .models import WorkExperience, Education, ProfessionalCertificate, PersonalDetail, Address, Attatchment
from django.core.mail import send_mail
from django.utils.crypto import get_random_string
from system.models import Employee, Department, Designation, Grade, ReportingManager, Role
from system.serializers import (
    DepartmentSerializer, 
    DesignationSerializer, 
    GradeSerializer, 
    RoleSerializer,
    ReportingManagerSerializer,
)
from django.conf import settings

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = "__all__"


class WorkExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkExperience
        fields = "__all__"


class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = "__all__"

    
class ProfessionalCertificateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfessionalCertificate
        fields = "__all__"


class AttatchmentSerializer(serializers.ModelSerializer):
    class Meta:
        model: Attatchment
        fields = "__all__"


class EmployeeOfficialDetailSerializer(serializers.ModelSerializer):
    department = DepartmentSerializer(read_only=True)
    designation = DesignationSerializer(read_only=True)
    grade = GradeSerializer(read_only=True)
    role1 = RoleSerializer(read_only=True)
    role2 = RoleSerializer(read_only=True)
    reporting_manager = ReportingManagerSerializer(read_only=True)

    # use ids for write operations
    department_id = serializers.PrimaryKeyRelatedField(
        queryset=Department.objects.all(), source="department", write_only=True, required=False
    )
    designation_id = serializers.PrimaryKeyRelatedField(
        queryset=Designation.objects.all(), source="designation", write_only=True, required=False
    )
    grade_id = serializers.PrimaryKeyRelatedField(
        queryset=Grade.objects.all(), source="grade", write_only=True, required=False
    )
    role1_id = serializers.PrimaryKeyRelatedField(
        queryset=Role.objects.all(), source="role1", write_only=True, required=False
    )
    role2_id = serializers.PrimaryKeyRelatedField(
        queryset=Role.objects.all(), source="role2", write_only=True, required=False
    )
    reporting_manager_id = serializers.PrimaryKeyRelatedField(
        queryset=ReportingManager.objects.all(), source="reporting_manager", write_only=True, required=False
    )

    class Meta:
        model = Employee
        fields = [
            "id", "name", "email",
            "joining_date", "basic_salary",
            "department", "designation", "grade",
            "reporting_manager", "role1", "role2",  "is_hr",
            "department_id", "designation_id", "grade_id", "reporting_manager_id", "role1_id", "role2_id",
            "reviewed_by_rm", "reviewed_by_hr", "reviewed_by_hod", "reviewed_by_coo", "reviewed_by_ceo",
        ]

    # --- CREATE ---
    def create(self, validated_data):
        email = validated_data.get("email")
        raw_password = get_random_string(length=8)
        

        employee = Employee.objects.create_user(
            password=raw_password,
            **validated_data
        )

        PersonalDetail.objects.create(
            employee=employee,
        )

        Attatchment.objects.create(
            employee=employee,
        )

        WorkExperience.objects.create(
            employee=employee,
            organization="Sonali Intellect Limited",
            designation= employee.designation.name if employee.designation else "",
            department= employee.department.name if employee.department else "",
            start_date= employee.joining_date,
            end_date=None,
        )

        # Email credentials
        send_mail(
            subject="Your Employee Account Credentials",
            message=f"Hello {employee.name},\n\n"
                    f"Your account has been created.\n"
                    f"Username: {email}\n"
                    f"Password: {raw_password}\n\n"
                    f"Please change your password after first login.",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False,
        )

        return employee


class EmployeePersonalDetailSerializer(serializers.ModelSerializer):
    # Include employee name
    employee_name = serializers.CharField(source='employee.name', read_only=True)

    class Meta:
        model = PersonalDetail
        fields = [
            "employee_name",
            "father_name", "mother_name", "phone_number", "personal_email",
            "date_of_birth", "national_id", "passport_number","blood_group", 
            "marital_status", "spouse_name", "spouse_nid",
            "emergency_contact_name", "emergency_contact_relationship", "emergency_contact_number",
        ]
    
    def update(self, instance, validated_data):
        user = self.context['request'].user  # logged-in user

        # HR can always update
        if user.is_hr:
            if 'phone_number' in validated_data:
                instance.phone_number = validated_data['phone_number']
            if 'national_id' in validated_data:
                instance.national_id = validated_data['national_id']
        else:
            # Employee can update phone_number and national_id only if currently null
            if 'phone_number' in validated_data and not instance.phone_number:
                instance.phone_number = validated_data['phone_number']
            if 'national_id' in validated_data and not instance.national_id:
                instance.national_id = validated_data['national_id']

        # Update other fields normally
        for attr, value in validated_data.items():
            if attr not in ['phone_number', 'national_id']:
                setattr(instance, attr, value)

        instance.save()
        return instance


class MyOfficialDetailSerializer(serializers.ModelSerializer):

    department = DepartmentSerializer(read_only=True)
    designation = DesignationSerializer(read_only=True)
    grade = GradeSerializer(read_only=True)
    reporting_manager = ReportingManagerSerializer(read_only=True)
    role1 = RoleSerializer(read_only=True)
    role2 = RoleSerializer(read_only=True)

    class Meta:
        model = Employee
        fields = [
            "name", "id", "email", 
            "designation", "department", "joining_date", 
            "grade", "reporting_manager", "role1", "role2",
            "is_hr"
        ]
        read_only_fields = fields  # everything is read-only


