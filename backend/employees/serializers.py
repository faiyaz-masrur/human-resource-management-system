from rest_framework import serializers
from .models import WorkExperience, Education, ProfessionalCertificate, PersonalDetail, Address, Attatchment
from django.core.mail import send_mail
from django.utils.crypto import get_random_string
from django.conf import settings
from .models import Employee
from system.utils.serializers import SmartUpdateSerializer


class AddressSerializer(SmartUpdateSerializer):
    class Meta:
        model = Address
        fields = "__all__"


class WorkExperienceSerializer(SmartUpdateSerializer):
    class Meta:
        model = WorkExperience
        fields = "__all__"


class EducationSerializer(SmartUpdateSerializer):
    class Meta:
        model = Education
        fields = "__all__"

    
class ProfessionalCertificateSerializer(SmartUpdateSerializer):
    class Meta:
        model = ProfessionalCertificate
        fields = "__all__"


class AttatchmentSerializer(SmartUpdateSerializer):
    class Meta:
        model = Attatchment
        fields = "__all__"


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
            "reporting_manager", "role", "is_active", "basic_salary",
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
            f"Thank you,\n\n"
            f"Sonali Intellect Limited, HR Team"
        )

        send_mail(
            subject=email_subject,
            message=email_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False,
        )

        return employee


class EmployeePersonalDetailSerializer(SmartUpdateSerializer):
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

        # Handle special rules for phone_number and national_id first
        if user.is_hr:
            # HR can always update these
            pass  # no restriction, SmartUpdateSerializer will handle changed fields
        else:
            # Employee can only set these if they are currently null
            if 'phone_number' in validated_data and instance.phone_number:
                validated_data.pop('phone_number')
            if 'national_id' in validated_data and instance.national_id:
                validated_data.pop('national_id')

        # Now let SmartUpdateSerializer handle actual update (only changed fields)
        return super().update(instance, validated_data)






