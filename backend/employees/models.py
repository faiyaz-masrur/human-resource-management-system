from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator, MinLengthValidator
from system.models import User, Department, Designation, Grade, SubGrade

# -----------------------------
# Employee Model
# -----------------------------
class Employee(User):
    employee_name = models.CharField(max_length=255)
    employee_id = models.CharField(max_length=4, validators=[MinLengthValidator(4)], unique=True)
    department = models.ForeignKey(
        Department,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name="department"
    )
    designation = models.ForeignKey(
        Designation,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name="designation"
    )
    joining_date = models.DateField()
    grade = models.ForeignKey(
        SubGrade,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name="subgrade"
    )
    basic_salary = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    # Link to Reporting Manager
    reporting_manager = models.ForeignKey(
        'ReportingManager',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='team_members'
    )

    responsibilities = models.TextField(blank=True)
    reviewed_by_rm = models.BooleanField(default=False)
    reviewed_by_hr = models.BooleanField(default=False)
    reviewed_by_hod = models.BooleanField(default=False)
    reviewed_by_coo = models.BooleanField(default=False)
    reviewed_by_ceo = models.BooleanField(default=False)

    signature = models.FileField(upload_to='media/employee_signature/', null=True, blank=True)
    image = models.FileField(upload_to='employee_image/', null=True, blank=True)

    def __str__(self):
        return self.employee_name

    class Meta:
        verbose_name = "Employee"
        verbose_name_plural = "Employees"

# -----------------------------
# Reporting Manager Model
# -----------------------------
class ReportingManager(models.Model):
    manager = models.OneToOneField(
        Employee,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name='as_manager'
    )

    def __str__(self):
        return f"{self.manager.employee_name} ({self.manager.employee_id})"

# -----------------------------
# Work Experience Model
# -----------------------------
class WorkExperience(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='work_experiences')
    organization = models.CharField(max_length=255)
    designation = models.CharField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField()

    def __str__(self):
        return f"{self.designation} at {self.organization}"

# -----------------------------
# Education Model
# -----------------------------
class Education(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='education')
    degree = models.CharField(max_length=100)
    institution = models.CharField(max_length=255)
    year = models.IntegerField()
    certificate_file = models.FileField(upload_to='educational_certificates/', null=True, blank=True)

    def __str__(self):
        return f"{self.degree} from {self.institution}"

# -----------------------------
# Professional Certificate Model
# -----------------------------
class ProfessionalCertificate(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='professional_certificates')
    certificate_name = models.CharField(max_length=255)
    credential_id = models.CharField(max_length=100, unique=True)
    institution = models.CharField(max_length=255)
    issue_date = models.DateField()
    certificate_file = models.FileField(upload_to='professional_certificates/', null=True, blank=True)

    def __str__(self):
        return self.certificate_name
