from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator


class Employee(models.Model):
    """
    Model for an employee in the system.
    
    This model is linked to the custom user model defined in settings.AUTH_USER_MODEL.
    """
    # The OneToOneField now correctly references the custom user model.
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='employee')
    employee_id = models.CharField(max_length=50, unique=True, help_text="A unique ID for the employee.")
    employee_name = models.CharField(max_length=255)
    designation = models.CharField(max_length=100)
    department = models.CharField(max_length=100)
    joining_date = models.DateField()
    grade = models.CharField(max_length=50)
    basic_salary = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    reporting_manager = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='managed_employees')
    responsibilities = models.TextField(blank=True)
    reviewed_by_rm = models.BooleanField(default=False)
    reviewed_by_hr = models.BooleanField(default=False)
    reviewed_by_hod = models.BooleanField(default=False)
    reviewed_by_coo = models.BooleanField(default=False)
    reviewed_by_ceo = models.BooleanField(default=False)

    def __str__(self):
        return self.employee_name

class WorkExperience(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='work_experiences')
    organization = models.CharField(max_length=255)
    designation = models.CharField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField()

    def __str__(self):
        return f"{self.designation} at {self.organization}"

class Education(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='education')
    degree = models.CharField(max_length=100)
    institution = models.CharField(max_length=255)
    year = models.IntegerField()
    certificate_file = models.FileField(upload_to='certificates/', null=True, blank=True)

    def __str__(self):
        return f"{self.degree} from {self.institution}"

class ProfessionalCertificate(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='professional_certificates')
    name = models.CharField(max_length=255)
    credential_id = models.CharField(max_length=100, unique=True)
    institution = models.CharField(max_length=255)
    issue_date = models.DateField()
    certificate_file = models.FileField(upload_to='professional_certs/', null=True, blank=True)

    def __str__(self):
        return self.name
