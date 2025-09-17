from rest_framework import serializers
from .models import Employee, WorkExperience, Education, ProfessionalCertificate


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
