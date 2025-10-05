import os
import json
from django.core.management.base import BaseCommand
from django.db import transaction
from system.models import (
    Department, Grade, Designation, Role,
    BdDistrict, BdThana, BloodGroup, MaritalStatus,
    EmergencyContactRelationship, Degree, Specialization
)

class Command(BaseCommand):
    help = "Load initial data for all choice tables"

    def handle(self, *args, **kwargs):
        json_path = os.path.join(os.path.dirname(__file__), "../../fixtures/initial_data.json")
        with open(json_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        with transaction.atomic():  # ensures all or nothing
            # Departments
            for dep in data.get("departments", []):
                Department.objects.get_or_create(name=dep["name"], defaults={"description": dep.get("description", "")})

            # Grades
            for g in data.get("grades", []):
                Grade.objects.get_or_create(name=g["name"], defaults={"description": g.get("description", "")})

            # Designations
            for des in data.get("designations", []):
                grade_obj = Grade.objects.filter(name=des.get("grade")).first()
                Designation.objects.get_or_create(
                    name=des["name"],
                    defaults={
                        "grade": grade_obj,
                        "description": des.get("description", "")
                    }
                )

            # Roles
            for r in data.get("roles", []):
                Role.objects.get_or_create(name=r["name"], defaults={"description": r.get("description", "")})

            # Districts + Thanas
            for d in data.get("districts", []):
                district_obj, _ = BdDistrict.objects.get_or_create(name=d["name"])
                for thana in d.get("thanas", []):
                    BdThana.objects.get_or_create(name=thana, district=district_obj)

            # Blood Groups
            for bg in data.get("blood_groups", []):
                BloodGroup.objects.get_or_create(key=bg["key"], defaults={"value": bg["value"]})

            # Marital Status
            for ms in data.get("marital_statuses", []):
                MaritalStatus.objects.get_or_create(key=ms["key"], defaults={"value": ms["value"]})

            # Emergency Contact Relationships
            for er in data.get("emergency_contact_relationships", []):
                EmergencyContactRelationship.objects.get_or_create(key=er["key"], defaults={"value": er["value"]})

            # Degrees
            for deg in data.get("degrees", []):
                Degree.objects.get_or_create(key=deg["key"], defaults={"value": deg["value"]})

            # Specializations
            for sp in data.get("specializations", []):
                Specialization.objects.get_or_create(key=sp["key"], defaults={"value": sp["value"]})

        self.stdout.write(self.style.SUCCESS("✅ All choice tables populated successfully."))
