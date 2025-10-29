from django.db import models
from system.models import (
    Employee,
    BloodGroup,
    MaritalStatus,
    EmergencyContactRelationship,
    Degree,
    Specialization,
    BdDistrict,
    BdThana,
)

# -----------------------------
# Employee Personal Details Model
# -----------------------------
class PersonalDetail(models.Model):
    employee = models.OneToOneField(
        Employee, 
        on_delete=models.CASCADE, 
        related_name='personal_details'
    )
    father_name = models.CharField(max_length=100, null=True, blank=True)
    mother_name = models.CharField(max_length=100, null=True, blank=True) 
    phone_number = models.CharField(max_length=15, null=True, blank=True)
    personal_email = models.EmailField(max_length=254, null=True, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)  
    national_id = models.CharField(max_length=20, unique=True, null=True, blank=True)
    passport_number = models.CharField(max_length=20, unique=True, null=True, blank=True)
    blood_group = models.ForeignKey(BloodGroup, on_delete=models.SET_NULL, null=True, blank=True, related_name='employees_personal_details')
    marital_status = models.ForeignKey(MaritalStatus, on_delete=models.SET_NULL, null=True, blank=True, related_name='employees_personal_details')
    spouse_name = models.CharField(max_length=100, null=True, blank=True)
    spouse_nid = models.CharField(max_length=20, unique=True, null=True, blank=True)
    emergency_contact_name = models.CharField(max_length=100, null=True, blank=True)
    emergency_contact_relationship = models.ForeignKey(EmergencyContactRelationship, on_delete=models.SET_NULL, null=True, blank=True, related_name='employees_personal_details')
    emergency_contact_number = models.CharField(max_length=15, null=True, blank=True)
    

    class Meta:
        verbose_name = "PersonalDetail"
        verbose_name_plural = "PersonalDetails"

    def __str__(self):
        return f"{self.employee.name} - Personal Details"
    
class Address(models.Model):
    employee = models.OneToOneField(Employee, on_delete=models.CASCADE, related_name='address')
    present_house = models.CharField(max_length=225, null=False, blank=False)
    present_road_block_sector = models.CharField(max_length=50, null=True, blank=True)
    present_city_village = models.CharField(max_length=100, null=True, blank=True)
    present_police_station = models.ForeignKey(BdThana, on_delete=models.SET_NULL, null=True, blank=True, related_name='employees_present_address')
    present_district = models.ForeignKey(BdDistrict, on_delete=models.SET_NULL, null=True, blank=True, related_name='employees_present_address')
    present_postal_code = models.CharField(max_length=20, null=False, blank=False)

    permanent_house = models.CharField(max_length=225, null=False, blank=False)
    permanent_road_block_sector = models.CharField(max_length=50, null=True, blank=True)
    permanent_city_village = models.CharField(max_length=100, null=True, blank=True)
    permanent_police_station = models.ForeignKey(BdThana, on_delete=models.SET_NULL, null=True, blank=True, related_name='employees_permanent_address')
    permanent_district = models.ForeignKey(BdDistrict, on_delete=models.SET_NULL, null=True, blank=True, related_name='employees_permanent_address')
    permanent_postal_code = models.CharField(max_length=20, null=False, blank=False)

    def __str__(self):
        return f"Address of {self.employee.name}"      

# -----------------------------
# Work Experience Model
# -----------------------------
class WorkExperience(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='work_experiences')
    organization = models.CharField(max_length=255, null=False, blank=False)
    designation = models.CharField(max_length=100, null=False, blank=False)
    department = models.CharField(max_length=100, null=False, blank=False)
    responsibilities = models.TextField(max_length=500, null=True, blank=True)
    start_date = models.DateField(null=False, blank=False)
    end_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.designation} at {self.organization}"

# -----------------------------
# Education Model
# -----------------------------
class Education(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='educations')
    degree = models.ForeignKey(Degree, on_delete=models.SET_NULL, null=True, blank=True, related_name='employees_education')
    institution = models.CharField(max_length=255, null=False, blank=False)
    passing_year = models.IntegerField(null=False, blank=False)
    specialization = models.ForeignKey(Specialization, on_delete=models.SET_NULL, null=True, blank=True, related_name='employees_education')
    result = models.CharField(max_length=50, null=False, blank=False)
    certificate = models.FileField(upload_to='educational_certificates/', null=True, blank=True)

    def __str__(self):
        return f"{self.degree} from {self.institution}"

# -----------------------------
# Training Certificate Model
# -----------------------------
class TrainingCertificate(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='training_certificates')
    title = models.CharField(max_length=255, null=False, blank=False)
    credential_id = models.CharField(max_length=100, null=True, blank=True, unique=True)
    institution = models.CharField(max_length=255, null=False, blank=False)
    issue_date = models.DateField(null=False, blank=False)
    type = models.CharField(max_length=100, null=True, blank=True)
    certificate = models.FileField(upload_to='professional_certificates/', null=True, blank=True)

    def __str__(self):
        return self.certificate_name


class Attatchment(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='attatchments')
    photo = models.ImageField(upload_to='employee_photos/', null=True, blank=True)
    signature = models.ImageField(upload_to='employee_signatures/', null=True, blank=True)
    natoinal_id = models.FileField(upload_to='employee_nid_scans/', null=True, blank=True)
    passport = models.FileField(upload_to='employee_passport_scans/', null=True, blank=True)
    employee_agreement = models.FileField(upload_to='employee_agreements/', null=True, blank=True)

    def __str__(self):
        return f"Attachments for {self.employee.name}"