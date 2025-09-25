from django.db import models
from system.models import Employee
from system.choices import (
    BLOOD_GROUP_CHOICES, 
    MARITAL_STATUS_CHOICES, 
    DEGREE_CHOICES,
    SPECIALIZATION_CHOICES,
    DISTRICT_CHOICES, 
    POLICE_STATION_CHOICES,
)

# -----------------------------
# Employee Personal Details Model
# -----------------------------
class PersonalDetail(models.Model):

    employee = models.OneToOneField(
        Employee, 
        on_delete=models.CASCADE, 
        primary_key=True, 
        related_name='employee'
    )
    father_name = models.CharField(max_length=100, null=True, blank=True)
    mother_name = models.CharField(max_length=100, null=True, blank=True) 
    phone_number = models.CharField(max_length=15, null=True, blank=True)
    personal_email = models.EmailField(max_length=254, null=True, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)  
    national_id = models.CharField(max_length=20, unique=True, null=True, blank=True)
    passport_number = models.CharField(max_length=20, unique=True, null=True, blank=True)
    blood_group = models.CharField(max_length=3, choices=BLOOD_GROUP_CHOICES, null=True, blank=True)
    marital_status = models.CharField(max_length=10, choices=MARITAL_STATUS_CHOICES, null=True, blank=True) 
    spouse_name = models.CharField(max_length=100, null=True, blank=True)
    spouse_nid = models.CharField(max_length=20, unique=True, null=True, blank=True)
    emergency_contact_name = models.CharField(max_length=100, null=True, blank=True)
    emergency_contact_relationship = models.CharField(max_length=50, null=True, blank=True)
    emergency_contact_number = models.CharField(max_length=15, null=True, blank=True)
    

    class Meta:
        verbose_name = "PersonalDetail"
        verbose_name_plural = "PersonalDetails"

    def __str__(self):
        return f"{self.employee.employee_name} - Personal Details"
    
class Address(models.Model):
    employee = models.OneToOneField(Employee, on_delete=models.CASCADE, primary_key=True, related_name='employee')
    present_house = models.CharField(max_length=225, null=True, blank=True)
    present_road_block_sector = models.CharField(max_length=50, null=True, blank=True)
    present_city_village = models.CharField(max_length=100, null=True, blank=True)
    present_police_station = models.CharField(max_length=100, choices=POLICE_STATION_CHOICES, null=True, blank=True)
    present_district = models.CharField(max_length=100, choices=DISTRICT_CHOICES, null=True, blank=True)
    present_postal_code = models.CharField(max_length=20, null=True, blank=True)

    permanent_house = models.CharField(max_length=225, null=True, blank=True)
    permanent_road_block_sector = models.CharField(max_length=50, null=True, blank=True)
    permanent_city_village = models.CharField(max_length=100, null=True, blank=True)
    permanent_police_station = models.CharField(max_length=100, choices=POLICE_STATION_CHOICES, null=True, blank=True)
    permanent_district = models.CharField(max_length=100, choices=DISTRICT_CHOICES, null=True, blank=True)
    permanent_postal_code = models.CharField(max_length=20, null=True, blank=True)

    def __str__(self):
        return f"Address of {self.employee.employee_name}"      

# -----------------------------
# Work Experience Model
# -----------------------------
class WorkExperience(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='employee')
    organization = models.CharField(max_length=255, required=True)
    designation = models.CharField(max_length=100, required=True)
    department = models.CharField(max_length=100, required=True)
    responsibilities = models.TextField(max_length=500, null=True, blank=True)
    start_date = models.DateField(required=True)
    end_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.designation} at {self.organization}"

# -----------------------------
# Education Model
# -----------------------------
class Education(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='employee')
    degree = models.CharField(max_length=100, choices=DEGREE_CHOICES, required=True)
    institution = models.CharField(max_length=255, required=True)
    passing_year = models.IntegerField()
    specialization = models.CharField(max_length=100, choices=SPECIALIZATION_CHOICES, required=True)
    results = models.CharField(max_length=50, required=True)
    certificate_file = models.FileField(upload_to='educational_certificates/', null=True, blank=True)

    def __str__(self):
        return f"{self.degree} from {self.institution}"

# -----------------------------
# Professional Certificate Model
# -----------------------------
class ProfessionalCertificate(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='employee')
    title = models.CharField(max_length=255, required=True)
    credential_id = models.CharField(max_length=100, required=True, unique=True)
    institution = models.CharField(max_length=255, required=True)
    issue_date = models.DateField()
    type = models.CharField(max_length=100, required=True)
    certificate_file = models.FileField(upload_to='professional_certificates/', null=True, blank=True)

    def __str__(self):
        return self.certificate_name


class Attatchment(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='employee')
    photo = models.ImageField(upload_to='employee_photos/', null=True, blank=True)
    signature = models.ImageField(upload_to='employee_signatures/', null=True, blank=True)
    natoinal_id = models.FileField(upload_to='employee_nid_scans/', null=True, blank=True)
    passport = models.FileField(upload_to='employee_passport_scans/', null=True, blank=True)
    employee_agreement = models.FileField(upload_to='employee_agreements/', null=True, blank=True)

    def __str__(self):
        return f"Attachment: {self.title} for {self.employee.employee_name}"