import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from .managers import CustomUserManager
from django.utils.crypto import get_random_string
from .choices import WORKSPACE_CHOICES, SUB_WORKSPACE_CHOICES

def generate_employee_id():
    return get_random_string(5).upper()  # Example: "A1B2C"


class Role(models.Model):
    name = models.CharField(max_length=50, unique=True)
    status = models.BooleanField(default=True)
    description = models.TextField(max_length=100, blank=True, null=True)

    class Meta:
        verbose_name = "Role"
        verbose_name_plural = "Roles"

    def __str__(self):
        return self.name


class RolePermission(models.Model):
    role = models.ForeignKey("Role", on_delete=models.CASCADE, related_name="permissions")
    workspace = models.CharField(max_length=50, choices=WORKSPACE_CHOICES) 
    sub_workspace = models.CharField(max_length=50, choices=SUB_WORKSPACE_CHOICES)
    view = models.BooleanField(default=False)
    create = models.BooleanField(default=False)
    edit = models.BooleanField(default=False)
    delete = models.BooleanField(default=False)
    download = models.BooleanField(default=False)

    class Meta:
        verbose_name = "System Role Permission"
        verbose_name_plural = "System Role Permissions"


class Department(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(max_length=100, blank=True, null=True)

    class Meta:
        verbose_name = "Department"
        verbose_name_plural = "Departments"

    def __str__(self):
        return self.name
    

class Grade(models.Model):
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(max_length=100, blank=True, null=True)

    class Meta:
        verbose_name = "Grade"
        verbose_name_plural = "Grades"

    def __str__(self):
        return self.name
    

class Designation(models.Model):
    name = models.CharField(max_length=100, unique=True)
    grade = models.ForeignKey(
        Grade, 
        on_delete=models.SET_NULL, 
        null=True, blank=True,
        related_name="designation",
    )

    class Meta:
        verbose_name = "Designation"
        verbose_name_plural = "Designations"

    def __str__(self):
        return self.name
    

class ReportingManager(models.Model):

    manager = models.OneToOneField(
        "Employee",  
        on_delete=models.CASCADE,
        primary_key=True,
        related_name="as_manager"
    )

    def __str__(self):
        return f"{self.manager.name}"
    

class Hr(models.Model):

    hr = models.OneToOneField(
        "Employee", 
        on_delete=models.CASCADE,
        primary_key=True,
        related_name="as_hr"
    )

    def __str__(self):
        return f"{self.hr.name}"
    

class Hod(models.Model):

    hod = models.OneToOneField(
        "Employee",  
        on_delete=models.CASCADE,
        primary_key=True,
        related_name="as_hod"
    )

    def __str__(self):
        return f"{self.hod.name}"
     

class Coo(models.Model):

    coo = models.OneToOneField(
        "Employee",  
        on_delete=models.CASCADE,
        primary_key=True,
        related_name="as_coo"
    )

    def __str__(self):
        return f"{self.coo.name}"
    

class Ceo(models.Model):

    ceo = models.OneToOneField(
        "Employee",  
        on_delete=models.CASCADE,
        primary_key=True,
        related_name="as_ceo"
    )

    def __str__(self):
        return f"{self.ceo.name}"


class Employee(AbstractUser):
    username = None
    first_name = None
    last_name = None
    date_joined = None

    id = models.CharField(
        primary_key=True,
        max_length=5, 
        unique=True,
        default=generate_employee_id,
    )

    email = models.EmailField(_('email address'), unique=True)

    name = models.CharField(max_length=255, null=True, blank=True)

    department = models.ForeignKey(
        Department,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name="employees"
    )

    designation = models.ForeignKey(
        Designation,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name="employees"
    )

    joining_date = models.DateField(null=True, blank=True)

    grade = models.ForeignKey(
        Grade,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name="employees"
    )

    basic_salary = models.IntegerField(
        null=True, blank=True,
        default=0
    )

    reporting_manager = models.ForeignKey(
        ReportingManager,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name="employee"
    )

    role = models.ForeignKey(
        Role,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name="employees"
    )

    reviewed_by_rm = models.BooleanField(default=False)
    reviewed_by_hr = models.BooleanField(default=False)
    reviewed_by_hod = models.BooleanField(default=False)
    reviewed_by_coo = models.BooleanField(default=False)
    reviewed_by_ceo = models.BooleanField(default=False)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email
    

class BdDistrict(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(max_length=100, blank=True, null=True)

    class Meta:
        verbose_name = "BD District"
        verbose_name_plural = "BD Districts"

    def __str__(self):
        return self.name
    

class BdThana(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(max_length=100, blank=True, null=True)

    district = models.ForeignKey(
        BdDistrict,
        on_delete=models.CASCADE,
        related_name="thanas"
    )

    class Meta:
        verbose_name = "BD Thana"
        verbose_name_plural = "BD Thanas"
        unique_together = ('name', 'district')

    def __str__(self):
        return f"{self.name}, {self.district.name}"
    

class BloodGroup(models.Model):
    name = models.CharField(max_length=3, unique=True)  # e.g., "A+", "O-"
    description = models.TextField(max_length=50, blank=True, null=True)  # e.g., "A Positive", "O Negative"

    class Meta:
        verbose_name = "Blood Group"
        verbose_name_plural = "Blood Groups"

    def __str__(self):
        return self.name
    
class MaritalStatus(models.Model):
    name = models.CharField(max_length=10, unique=True)  # e.g., "single", "married"
    description = models.TextField(max_length=50, blank=True, null=True)  # e.g., "Single", "Married"

    class Meta:
        verbose_name = "Marital Status"
        verbose_name_plural = "Marital Statuses"

    def __str__(self):
        return self.name
    
class EmergencyContactRelationship(models.Model):
    name = models.CharField(max_length=15, unique=True)  # e.g., "parent", "sibling"
    description = models.TextField(max_length=50, blank=True, null=True)  # e.g., "Parent", "Sibling"

    class Meta:
        verbose_name = "Emergency Contact Relationship"
        verbose_name_plural = "Emergency Contact Relationships"

    def __str__(self):
        return self.name
    
class Degree(models.Model):
    name = models.CharField(max_length=10, unique=True)  # e.g., "BSC", "MBA"
    description = models.TextField(max_length=100, blank=True, null=True)  # e.g., "Bachelor of Science", "Master of Business Administration"

    class Meta:
        verbose_name = "Degree"
        verbose_name_plural = "Degrees"

    def __str__(self):
        return self.name
    
class Specialization(models.Model):
    name = models.CharField(max_length=10, unique=True)  # e.g., "CSE", "EEE"
    description = models.TextField(max_length=100, blank=True, null=True)  # e.g., "Computer Science & Engineering", "Electrical & Electronic Engineering"

    class Meta:
        verbose_name = "Specialization"
        verbose_name_plural = "Specializations"

    def __str__(self):
        return self.name


class TrainingType(models.Model):
    name = models.CharField(max_length=50, unique=True)  
    description = models.TextField(max_length=100, blank=True, null=True)  

    class Meta:
        verbose_name = "TrainingType"
        verbose_name_plural = "TrainingTypes"

    def __str__(self):
        return self.name