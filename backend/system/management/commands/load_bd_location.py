import json
import os
from django.core.management.base import BaseCommand
from system.models import BdDistrict, BdThana  # your app is 'system'

class Command(BaseCommand):
    help = "Populate BD districts and thanas from JSON files in fixtures folder"

    def handle(self, *args, **kwargs):

        base_dir = os.path.dirname(os.path.abspath(__file__)) 
        fixtures_dir = os.path.join(base_dir, "../../fixtures") 

        districts_file = os.path.join(fixtures_dir, "districts.json")
        upazilas_file = os.path.join(fixtures_dir, "upazilas.json")
        blood_groups_file = os.path.join(fixtures_dir, "bloodgroups.json")
        marital_status_file = os.path.join(fixtures_dir, "maritalstatus.json")
        emergency_contact_relationships_file = os.path.join(fixtures_dir, "emergencyContactRelationships.json")
        degrees_file = os.path.join(fixtures_dir, "degrees.json")
        specializations_file = os.path.join(fixtures_dir, "specializations.json")
        departments_file = os.path.join(fixtures_dir, "departments.json")
        grades_file = os.path.join(fixtures_dir, "grades.json")
        designations_file = os.path.join(fixtures_dir, "designations.json")
        roles_file = os.path.join(fixtures_dir, "roles.json")

        # Load districts
        with open(districts_file, encoding="utf-8") as f:
            districts_data = json.load(f)

        # Create district mapping
        district_mapping = {}
        for district in districts_data:
            district_obj, created = BdDistrict.objects.get_or_create(name=district["name"])
            district_mapping[district["id"]] = district_obj
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created district: {district['name']}"))

        # Load thanas/upazilas
        with open(upazilas_file, encoding="utf-8") as f:
            thanas_data = json.load(f)

        # Populate thanas
        for thana in thanas_data:
            district_id = thana["district_id"]
            district_obj = district_mapping.get(district_id)
            if not district_obj:
                self.stdout.write(self.style.ERROR(f"District ID {district_id} not found for thana {thana['name']}"))
                continue

            thana_obj, created = BdThana.objects.get_or_create(name=thana["name"], district=district_obj)
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created thana: {thana['name']} under {district_obj.name}"))

        self.stdout.write(self.style.SUCCESS("Population complete!"))
