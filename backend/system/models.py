import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from .managers import CustomUserManager

# Create your models here.
class User(AbstractUser):
    id = id = models.UUIDField(
        primary_key=True, 
        default=uuid.uuid4, 
        editable=False, 
        unique=True
    )
    username = None
    email = models.EmailField(_('email address'), unique=True)
    
    

    # Remove first_name and last_name fields
    first_name = None
    last_name = None
    date_joined = None

    is_rm = models.BooleanField(default=False)
    is_hr = models.BooleanField(default=False)
    is_hod = models.BooleanField(default=False)
    is_coo = models.BooleanField(default=False)
    is_ceo = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []  

    objects = CustomUserManager()

    def __str__(self):
        return self.email


class Department(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = "Department"
        verbose_name_plural = "Departments"

    def __str__(self):
        return self.name


class Designation(models.Model):
    name = models.CharField(max_length=100, unique=True)
    department = models.ForeignKey(
        Department,
        on_delete=models.CASCADE,
        related_name="designations"
    )
    description = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = "Designation"
        verbose_name_plural = "Designations"

    def __str__(self):
        return f"{self.name} ({self.department.name})"


class Grade(models.Model):
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = "Grade"
        verbose_name_plural = "Grades"

    def __str__(self):
        return f"{self.name}"


class SubGrade(models.Model):
    name = models.CharField(max_length=50)
    grade = models.ForeignKey(
        Grade,
        on_delete=models.CASCADE,
        related_name="subgrades"
    )
    description = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = "Subgrade"
        verbose_name_plural = "Subgrades"
        unique_together = ("name", "grade")

    def __str__(self):
        return f"{self.grade.name} - {self.name}"

