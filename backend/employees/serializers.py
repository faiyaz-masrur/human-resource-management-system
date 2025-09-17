from rest_framework import serializers
from .models import Employee, WorkExperience, Education, ProfessionalCertificate
from rest_framework import serializers
from django.core.mail import send_mail
from django.contrib.auth.hashers import make_password
from django.utils.crypto import get_random_string
from system.models import User, Department, Designation, Grade
from django.conf import settings

class WorkExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkExperience
        fields = ["id", "organization", "designation", "start_date", "end_date"]


class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = ["id", "degree", "institution", "year", "certificate_file"]


class ProfessionalCertificateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfessionalCertificate
        fields = ["id", "certificate_name", "credential_id", "institution", "issue_date", "certificate_file"]


class EmployeeListSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user_ptr.email", read_only=True)
    department = serializers.CharField(source="department.name", allow_null=True)
    designation = serializers.CharField(source="designation.name", allow_null=True)

    class Meta:
        model = Employee
        fields = [
            'id', 'employee_name', 'employee_id', 'email',
            'department', 'designation',
        ]


class EmployeeCreateUpdateDeleteSerializer(serializers.ModelSerializer):
    # User fields
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=False)

    # Role fields (from User)
    is_rm = serializers.BooleanField(required=False)
    is_hr = serializers.BooleanField(required=False)
    is_hod = serializers.BooleanField(required=False)
    is_coo = serializers.BooleanField(required=False)
    is_ceo = serializers.BooleanField(required=False)
    is_admin = serializers.BooleanField(required=False)

    reviewed_by_rm = serializers.BooleanField(required=False)
    reviewed_by_hr = serializers.BooleanField(required=False)
    reviewed_by_hod = serializers.BooleanField(required=False)
    reviewed_by_coo = serializers.BooleanField(required=False)
    reviewed_by_ceo = serializers.BooleanField(required=False)

    # Nested children
    work_experiences = WorkExperienceSerializer(many=True, required=False)
    education = EducationSerializer(many=True, required=False)
    professional_certificates = ProfessionalCertificateSerializer(many=True, required=False)


    all_departments = serializers.SerializerMethodField(read_only=True)
    all_designations = serializers.SerializerMethodField(read_only=True)
    all_grades = serializers.SerializerMethodField(read_only=True)
    all_reporting_managers = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Employee
        fields = [
            "id", "employee_id", "employee_name", "email",
            'department', 'designation', 'grade', 'reporting_manager', 
            "all_departments", "all_designations", "all_grades", "all_reporting_managers"
            "joining_date", "basic_salary", "responsibilities",
            "is_rm", "is_hr", "is_hod", "is_coo", "is_ceo", "is_admin",
            "reviewed_by_rm", "reviewed_by_hr", "reviewed_by_hod", "reviewed_by_coo", "reviewed_by_ceo",
            "work_experiences", "education", "professional_certificates"
            "signature", "image",
        ]
        read_only_fields = ["id"]

    def get_all_departments(self, obj):
        return [{"id": d.id, "name": d.name} for d in Department.objects.all()]

    def get_all_designations(self, obj):
        return [{"id": d.id, "name": d.name} for d in Designation.objects.all()]

    def get_all_grades(self, obj):
        return [{"id": g.id, "name": g.name, "grade": g.grade.name} for g in Grade.objects.all()]

    def get_all_reporting_managers(self, obj):
        return [{"id": e.id, "employee_name": e.employee_name, "employee_id": e.employee_id} 
                for e in Employee.objects.all()]

    # --- CREATE ---
    def create(self, validated_data):
        email = validated_data.pop("email")
        raw_password = get_random_string(length=8)

        # Nested
        work_experiences = validated_data.pop("work_experiences", [])
        educations = validated_data.pop("education", [])
        certificates = validated_data.pop("professional_certificates", [])

        user = User.objects.create(
            email=email,
            password=make_password(raw_password)  # hash the password
        )

        employee = Employee.objects.create(user_ptr=user, **validated_data)

        # Children
        for exp in work_experiences:
            WorkExperience.objects.create(employee=employee, **exp)
        for edu in educations:
            Education.objects.create(employee=employee, **edu)
        for cert in certificates:
            ProfessionalCertificate.objects.create(employee=employee, **cert)

        # Email credentials
        send_mail(
            subject="Your Employee Account Credentials",
            message=f"Hello {employee.employee_name},\n\n"
                    f"Your account has been created.\n"
                    f"Username: {email}\n"
                    f"Password: {raw_password}\n\n"
                    f"Please change your password after first login.",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False,
        )

        return employee

    # --- UPDATE ---
    def update(self, instance, validated_data):
        email = validated_data.pop("email", None)

        work_experiences = validated_data.pop("work_experiences", None)
        educations = validated_data.pop("education", None)
        certificates = validated_data.pop("professional_certificates", None)

        # Update User fields
        if email:
            instance.email = email

        # Update Employee fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Replace children if given
        if work_experiences is not None:
            instance.work_experiences.all().delete()
            for exp in work_experiences:
                WorkExperience.objects.create(employee=instance, **exp)

        if educations is not None:
            instance.education.all().delete()
            for edu in educations:
                Education.objects.create(employee=instance, **edu)

        if certificates is not None:
            instance.professional_certificates.all().delete()
            for cert in certificates:
                ProfessionalCertificate.objects.create(employee=instance, **cert)

        return instance


class EmployeeProfileSerializer(serializers.ModelSerializer):
    work_experiences = WorkExperienceSerializer(many=True, required=False)
    education = EducationSerializer(many=True, required=False)
    professional_certificates = ProfessionalCertificateSerializer(many=True, required=False)
    department = serializers.CharField(source='department.name', allow_null=True)
    designation = serializers.CharField(source='designation.name', allow_null=True)
    grade = serializers.CharField(source='grade.name', allow_null=True)
    reporting_manager = serializers.CharField(source='reporting_manager.employee_name', allow_null=True)


    class Meta:
        model = Employee 
        fields = [
            "id","employee_id", "employee_name", "department", "designation",
            "joining_date", "grade", "reporting_manager",
            "responsibilities", "work_experiences", "education", "professional_certificates",
            "signature", "image"
        ]
        read_only_fields = [
            "id","employee_id", "employee_name", "department", "designation",
            "joining_date", "grade", "reporting_manager"
        ]

    def update(self, instance, validated_data):
        # Extract nested relations
        work_experiences = validated_data.pop("work_experiences", None)
        educations = validated_data.pop("education", None)
        certificates = validated_data.pop("professional_certificates", None)

        # Update allowed fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update work experiences
        if work_experiences is not None:
            instance.work_experiences.all().delete()
            for exp in work_experiences:
                WorkExperience.objects.create(employee=instance, **exp)

        # Update education
        if educations is not None:
            instance.education.all().delete()
            for edu in educations:
                Education.objects.create(employee=instance, **edu)

        # Update certificates
        if certificates is not None:
            instance.professional_certificates.all().delete()
            for cert in certificates:
                ProfessionalCertificate.objects.create(employee=instance, **cert)

        return instance
