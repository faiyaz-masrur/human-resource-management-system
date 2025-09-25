import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from .managers import CustomUserManager
from django.core.validators import MinLengthValidator
from .choices import ROLE_CHOICES


class Department(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = "Department"
        verbose_name_plural = "Departments"

    def __str__(self):
        return self.name
    

class Grade(models.Model):
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True, null=True)

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
    description = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = "Designation"
        verbose_name_plural = "Designations"

    def __str__(self):
        return self.name


class ReportingManager(models.Model):
    # Will be linked to Employee later
    manager = models.OneToOneField(
        "Employee",   # string ref since Employee is defined later
        on_delete=models.CASCADE,
        primary_key=True,
        related_name="as_manager"
    )

    def __str__(self):
        return f"{self.manager.employee_name}"


class Employee(AbstractUser):
    username = None
    first_name = None
    last_name = None
    date_joined = None

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )

    email = models.EmailField(_('email address'), unique=True)

    employee_name = models.CharField(max_length=255)

    employee_id = models.CharField(
        max_length=4,
        validators=[MinLengthValidator(4)],
        unique=True
    )

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

    joining_date = models.DateField(null=True, blank=True,)

    grade = models.ForeignKey(
        Grade,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name="employees"
    )

    basic_salary = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0.00
    )

    reporting_manager = models.ForeignKey(
        ReportingManager,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name="employee"
    )

    role1 = models.CharField(max_length=10, choices=ROLE_CHOICES, null=True, blank=True)

    role2 = models.CharField(max_length=10, choices=ROLE_CHOICES, null=True, blank=True)

    is_hr = models.BooleanField(default=False)

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
