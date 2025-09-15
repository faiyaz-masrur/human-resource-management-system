from rest_framework import serializers
from .models import Employee, WorkExperience, Education, ProfessionalCertificate


class WorkExperienceSerializer(serializers.ModelSerializer):
    """
    Serializer for the WorkExperience model.
    """
    class Meta:
        model = WorkExperience
        fields =  '__all__'



class EducationSerializer(serializers.ModelSerializer):
    """
    Serializer for the Education model.
    """
    class Meta:
        model = Education
        fields =  '__all__'



class ProfessionalCertificateSerializer(serializers.ModelSerializer):
    """
    Serializer for the ProfessionalCertificate model.
    """
    class Meta:
        model = ProfessionalCertificate
        fields =  '__all__'



class EmployeeProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for the Employee model, focusing on fields an employee can edit.
    It includes nested serializers for work experience, education, and certificates.
    """
    work_experiences = WorkExperienceSerializer(many=True, required=False)
    education = EducationSerializer(many=True, required=False)
    professional_certificates = ProfessionalCertificateSerializer(many=True, required=False)
    
    # These fields are read-only as they are set by HR/Admins
    email = serializers.EmailField(read_only=True)
    employee_id = serializers.CharField(read_only=True)
    department = serializers.CharField(source='department.department_name', read_only=True)
    designation = serializers.CharField(source='designation.designation_name', read_only=True)
    joining_date = serializers.DateField(read_only=True)
    grade = serializers.CharField(source='grade.sub_grade_name', read_only=True)
    basic_salary = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    reporting_manager = serializers.CharField(source='reporting_manager.employee_name', read_only=True)
    employee_name = serializers.CharField(read_only=True)


    class Meta:
        model = Employee
        fields = [
            'id', 'employee_name', 'email', 'employee_id', 'department', 'designation', 
            'joining_date', 'grade', 'basic_salary', 'reporting_manager', 
            'responsibilities', 'signature', 'image',
            'work_experiences', 'education', 'professional_certificates'
        ]
        read_only_fields = ['id']

    def update(self, instance, validated_data):
        """
        Custom update method to handle nested updates for related models.
        It deletes existing related objects and creates new ones.
        """
        # Handle nested data for Work Experience
        work_experiences_data = validated_data.pop('work_experiences', [])
        instance.work_experiences.all().delete()
        for exp_data in work_experiences_data:
            WorkExperience.objects.create(employee=instance, **exp_data)

        # Handle nested data for Education
        education_data = validated_data.pop('education', [])
        instance.education.all().delete()
        for edu_data in education_data:
            Education.objects.create(employee=instance, **edu_data)

        # Handle nested data for Professional Certificates
        professional_certificates_data = validated_data.pop('professional_certificates', [])
        instance.professional_certificates.all().delete()
        for cert_data in professional_certificates_data:
            ProfessionalCertificate.objects.create(employee=instance, **cert_data)

        # Update and save the Employee instance
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance
