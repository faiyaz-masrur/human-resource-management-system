import os
import json
from django.core.management.base import BaseCommand
from django.db import transaction
from system.models import (
    Department, Grade, Designation, Role,
    BdDistrict, BdThana, BloodGroup, MaritalStatus,
    EmergencyContactRelationship, Degree, Specialization, RolePermission, TrainingType
)

class Command(BaseCommand):
    help = "Populate BD districts and thanas from JSON files in fixtures folder"

    @transaction.atomic
    def handle(self, *args, **kwargs):

        base_dir = os.path.dirname(os.path.abspath(__file__)) 
        fixtures_dir = os.path.join(base_dir, "../../fixtures") 

        districts_file = os.path.join(fixtures_dir, "districts.json")
        thanas_file = os.path.join(fixtures_dir, "thanas.json")
        blood_groups_file = os.path.join(fixtures_dir, "bloodgroups.json")
        marital_status_file = os.path.join(fixtures_dir, "maritalstatus.json")
        emergency_contact_relationships_file = os.path.join(fixtures_dir, "emergencyContactRelationships.json")
        degrees_file = os.path.join(fixtures_dir, "degrees.json")
        specializations_file = os.path.join(fixtures_dir, "specializations.json")
        training_type_file = os.path.join(fixtures_dir, "trainingType.json")
        departments_file = os.path.join(fixtures_dir, "departments.json")
        grades_file = os.path.join(fixtures_dir, "grades.json")
        designations_file = os.path.join(fixtures_dir, "designations.json")
        roles_file = os.path.join(fixtures_dir, "roles.json")
        role_permissions_file = os.path.join(fixtures_dir, "rolePermissions.json")


        # Load districts
        with open(districts_file, encoding="utf-8") as f:
            districts_data = json.load(f)

        # Create district mapping
        obj_mapping = {}
        for district in districts_data:
            district_obj, created = BdDistrict.objects.get_or_create(name=district["district_name"])
            obj_mapping[district["id"]] = district_obj
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created district: {district_obj.name}"))


        # Load thanas/upazilas
        with open(thanas_file, encoding="utf-8") as f:
            thanas_data = json.load(f)

        # Populate thanas
        for thana in thanas_data:
            district_id = thana["district_id"]
            district_obj = obj_mapping.get(district_id)
            if not district_obj:
                raise ValueError(f"District ID {district_id} not found for thana {thana['thana_name']}")

            thana_obj, created = BdThana.objects.get_or_create(name=thana["thana_name"], district=district_obj)
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created thana: {thana_obj.name} under {district_obj.name}"))
        obj_mapping.clear()


        # Blood Groups
        with open(blood_groups_file, encoding="utf-8") as f:
            blood_groups_data = json.load(f)

        for blood_group in blood_groups_data:
            blood_group_obj, created = BloodGroup.objects.get_or_create(name=blood_group["name"], description=blood_group["description"])
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created blood group: {blood_group_obj.name}"))


        # Marital Status
        with open(marital_status_file, encoding="utf-8") as f:
            marital_status_data = json.load(f)

        for marital_status in marital_status_data:
            marital_status_obj, created = MaritalStatus.objects.get_or_create(name=marital_status["name"], description=marital_status["description"])
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created marital status: {marital_status_obj.name}"))


        # Emergency Contact Relationships
        with open(emergency_contact_relationships_file, encoding="utf-8") as f:
            emergency_contact_relationships_data = json.load(f)

        for emergency_contact_relationship in emergency_contact_relationships_data:
            emergency_contact_relationship_obj, created = EmergencyContactRelationship.objects.get_or_create(name=emergency_contact_relationship["name"], description=emergency_contact_relationship["description"])
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created emergency_contact_relationship: {emergency_contact_relationship_obj.name}"))


        # Degrees
        with open(degrees_file, encoding="utf-8") as f:
            degrees_data = json.load(f)

        for degree in degrees_data:
            degree_obj, created = Degree.objects.get_or_create(name=degree["name"], description=degree["description"])
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created degree: {degree_obj.name}"))


        # Specializations
        with open(specializations_file, encoding="utf-8") as f:
            specializations_data = json.load(f)

        for specialization in specializations_data:
            specialization_obj, created = Specialization.objects.get_or_create(name=specialization["name"], description=specialization["description"])
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created specialization: {specialization_obj.name}"))


        # Trainingtypes
        with open(training_type_file, encoding="utf-8") as f:
            training_type_data = json.load(f)

        for training_type in training_type_data:
            training_type_obj, created = TrainingType.objects.get_or_create(name=training_type["name"], description=training_type["description"])
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created training types: {training_type_obj.name}"))


        # Departments
        with open(departments_file, encoding="utf-8") as f:
            departments_data = json.load(f)

        for department in departments_data:
            department_obj, created = Department.objects.get_or_create(name=department["name"], description=department["description"])
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created department: {department_obj.name}"))


        # Grades
        with open(grades_file, encoding="utf-8") as f:
            grades_data = json.load(f)

        obj_mapping = {}
        for grade in grades_data:
            grade_obj, created = Grade.objects.get_or_create(name=grade["name"], description=grade["description"])
            obj_mapping[grade["name"]] = grade_obj
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created grade: {grade_obj.name}"))


        # Designations
        with open(designations_file, encoding="utf-8") as f:
            designations_data = json.load(f)

        for designation in designations_data:
            grade_name = designation.get("grade")
            grade_obj = obj_mapping.get(grade_name)
            if not grade_obj:
                raise ValueError(f"Grade '{grade_name}' not found for designation '{designation['name']}'")

            designation_obj, created = Designation.objects.get_or_create(name=designation["name"], grade=grade_obj, description=designation["description"])
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created designation: {designation_obj.name}"))
        obj_mapping.clear()


        # Roles
        with open(roles_file, encoding="utf-8") as f:
            roles_data = json.load(f)

        obj_mapping = {}
        for role in roles_data:
            role_obj, created = Role.objects.get_or_create(name=role["name"], description=role["description"])
            obj_mapping[role["name"]] = role_obj
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created role: {role_obj.name}"))

        
        # Role Permissions
        with open(role_permissions_file, encoding="utf-8") as f:
            role_permissions_data = json.load(f)

        for role_permission in role_permissions_data:
            role_name = role_permission.get("role")
            role_obj = obj_mapping.get(role_name)
            if not role_obj:
                raise ValueError(f"Role '{role_name}' not found for role permission '{role_permission['workspace']}'")

            role_permission_obj, created = RolePermission.objects.get_or_create(role=role_obj, workspace=role_permission['workspace'], sub_workspace=role_permission['sub_workspace'], view=role_permission['view'], create=role_permission['create'], edit=role_permission['edit'], delete=role_permission['delete'])
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created role permission: {role_permission_obj.role} - {role_permission_obj.sub_workspace}"))
        obj_mapping.clear()


        self.stdout.write(self.style.SUCCESS("Population complete!"))
