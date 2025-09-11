from django.test import TestCase

from django.urls import reverse
from employees.models import Employee # Assuming a related Employee model

from .models import EmployeeAppraisal, AttendanceSummary

class EmployeeAppraisalModelTest(TestCase):
    def setUp(self):
        # Create a test employee instance to link the appraisal to
        self.employee = Employee.objects.create(
            employee_name="Test Employee",
            employee_id="E001"
            # Add other necessary fields for the Employee model
        )

    def test_appraisal_creation(self):
        """
        Tests that an EmployeeAppraisal object can be created and the __str__ method works.
        """
        appraisal = EmployeeAppraisal.objects.create(
            employee=self.employee,
            review_period_start='2024-01-01',
            review_period_end='2024-12-31',
            achievements='Test achievements',
            strengths='Test strengths',
            improvements='Test improvements',
            training_needs='Test training needs',
        )
        self.assertEqual(appraisal.employee, self.employee)
        self.assertIsInstance(appraisal, EmployeeAppraisal)
        self.assertEqual(str(appraisal), f"Self-Appraisal for {self.employee.employee_name} (2024-01-01 - 2024-12-31)")

class AttendanceSummaryModelTest(TestCase):
    def setUp(self):
        self.employee = Employee.objects.create(
            employee_name="Test Employee",
            employee_id="E001"
            # Add other necessary fields for the Employee model
        )

    def test_attendance_rating_calculation(self):
        """
        Tests that the calculate_and_rate_attendance method correctly assigns a rating.
        """
        summary = AttendanceSummary.objects.create(
            employee=self.employee,
            casual_leave_taken=5,
            sick_leave_taken=2,
            earned_leave_taken=3
        )
        
        # We need to manually provide total_working_days here as it's not in the model
        total_working_days = 250
        summary.calculate_and_rate_attendance(total_working_days)
        
        # Calculate expected values
        expected_total_leave = 5 + 2 + 3
        expected_percentage = (total_working_days - expected_total_leave) / total_working_days * 100
        
        # Assert the calculated values are correct
        self.assertEqual(summary.total_leave_taken, expected_total_leave)
        self.assertAlmostEqual(summary.attendance_percentage, expected_percentage, places=2)

        # Test rating based on percentage
        # You would need to update this test with the correct total_working_days to match your logic
        # For example, if percentage is 95%, rating should be 'Very Good'
        summary.attendance_percentage = 95.0
        summary.save()
        summary.calculate_and_rate_attendance(total_working_days)
        self.assertEqual(summary.attendance_rating, 'Very Good')

