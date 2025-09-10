from django.db import models
from employees.models import Employee

class EmployeeAppraisal(models.Model):
    """
    Appraisal form filled out by the employee.
    
    """
    appraisal_id = models.AutoField(primary_key=True)
    employee = models.ForeignKey(Employee, on_delete=models.PROTECT, related_name='self_appraisals')
    review_period_start = models.DateField()
    review_period_end = models.DateField()
    achievements = models.TextField(max_length=1000)
    strengths = models.TextField(max_length=1000)
    improvements = models.TextField(max_length=1000)
    training_needs = models.TextField(max_length=500)
    
    # Fields to handle the multiple choice options
    soft_skills_training = models.BooleanField(default=False)
    business_training = models.BooleanField(default=False)
    technical_training = models.BooleanField(default=False)
    
    is_review_period_active = models.BooleanField(default=True)
    
    def __str__(self):
        return f"Self-Appraisal for {self.employee.employee_name} ({self.review_period_start} - {self.review_period_end})"

class AttendanceSummary(models.Model):
    """
    Model to store attendance summary for an employee, used in the HR review.
    """
    summary_id = models.AutoField(primary_key=True)
    employee = models.ForeignKey(Employee, on_delete=models.PROTECT, related_name='attendance_summaries')
    casual_leave_taken = models.IntegerField(default=0)
    sick_leave_taken = models.IntegerField(default=0)
    earned_leave_taken = models.IntegerField(default=0)
    total_leave_taken = models.IntegerField(default=0)
    attendance_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    attendance_rating = models.CharField(max_length=50, blank=True)
    
    def calculate_and_rate_attendance(self):
        """
        Calculates total leave, percentage, and rating based on total working days.
        """
        self.total_leave_taken = self.casual_leave_taken + self.sick_leave_taken + self.earned_leave_taken
        
        # Determine the rating based on the percentage
        if 91 <= self.attendance_percentage <= 100:
            self.attendance_rating = 'Very Good'
        elif 81 <= self.attendance_percentage <= 90:
            self.attendance_rating = 'Good'
        elif 70 <= self.attendance_percentage <= 80:
            self.attendance_rating = 'Average'
        else:
            self.attendance_rating = 'Below Average'
    
    def __str__(self):
        return f"Attendance for {self.employee.employee_name}"

class SalaryRecommendation(models.Model):
    """
    Model for salary and promotion recommendations, used in the HR review.
    """
    recommendation_id = models.AutoField(primary_key=True)
    employee = models.ForeignKey(Employee, on_delete=models.PROTECT, related_name='salary_recommendations')
    current_basic = models.DecimalField(max_digits=10, decimal_places=2)
    current_gross = models.DecimalField(max_digits=10, decimal_places=2)
    proposed_basic = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    proposed_gross = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    gross_difference = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    def __str__(self):
        return f"Salary Recommendation for {self.employee.employee_name}"

class ReportingManagerReview(models.Model):
    """
    Review form for the Reporting Manager.
    """
    OVERALL_PERFORMANCE_RATING_CHOICES = [
        ('does_not_meet', 'Does not meet expectation'),
        ('partially_meets', 'Partially meets expectation'),
        ('meets_expectation', 'Meets expectation'),
        ('meets_most_expectation', 'Meets most expectation'),
        ('exceeds_expectation', 'Exceeds Expectation'),
    ]

    POTENTIAL_RATING_CHOICES = [
        ('low_potential', 'Low Potential'),
        ('medium_potential', 'Medium potential'),
        ('high_potential', 'High potential'),
    ]

    appraisal = models.OneToOneField(EmployeeAppraisal, on_delete=models.PROTECT, related_name='manager_review')
    reviewer = models.ForeignKey(Employee, on_delete=models.PROTECT, related_name='manager_appraisals')
    achievements_remarks = models.TextField(max_length=1000, null=True, blank=True)
    training_remarks = models.TextField(max_length=1000, null=True, blank=True)
    justify_overall_rating = models.TextField(max_length=1000, null=True, blank=True)
    overall_performance_rating = models.CharField(
        max_length=50, 
        choices=OVERALL_PERFORMANCE_RATING_CHOICES, 
        null=True, 
        blank=True
    )
    potential_rating = models.CharField(
        max_length=50, 
        choices=POTENTIAL_RATING_CHOICES,
        null=True, 
        blank=True
    )
    decision_remarks = models.TextField(max_length=500, null=True, blank=True)
    
    def __str__(self):
        return f"Manager Review for {self.appraisal.employee.employee_name}"

class HRReview(models.Model):
    """
    Review form for HR, linking to Salary and Attendance models.
    """
    appraisal = models.OneToOneField(EmployeeAppraisal, on_delete=models.PROTECT, related_name='hr_review')
    reviewer = models.ForeignKey(Employee, on_delete=models.PROTECT, related_name='hr_appraisals')
    remarks = models.TextField(max_length=1000, null=True, blank=True)
    attendance_summary = models.ForeignKey(AttendanceSummary, on_delete=models.SET_NULL, null=True, blank=True, related_name='hr_reviews')
    salary_recommendation = models.OneToOneField(SalaryRecommendation, on_delete=models.SET_NULL, null=True, blank=True, related_name='hr_reviews')
    
    # Decisions as per data field document
    promotion_recommended_with_increment = models.BooleanField(default=False)
    promotion_recommended_with_pp = models.BooleanField(default=False)
    increment_recommended = models.BooleanField(default=False)
    pay_progression_recommended = models.BooleanField(default=False)
    promotion_increment_pp_deferred = models.BooleanField(default=False)
    
    decision_remarks = models.TextField(max_length=500, null=True, blank=True)
    
    def __str__(self):
        return f"HR Review for {self.appraisal.employee.employee_name}"

class FinalReview(models.Model):
    """
    A single model for HOD, COO, and CEO reviews, as the form is the same.
    """
    REVIEWER_ROLES = [
        ('hod', 'HOD'),
        ('coo', 'COO'),
        ('ceo', 'CEO'),
    ]

    appraisal = models.ForeignKey(EmployeeAppraisal, on_delete=models.PROTECT, related_name='final_reviews')
    reviewer = models.ForeignKey(Employee, on_delete=models.PROTECT, related_name='final_review_appraisals')
    reviewer_role = models.CharField(max_length=10, choices=REVIEWER_ROLES)
    agreement_remarks = models.TextField(max_length=1000, null=True, blank=True)
    decision_remarks = models.TextField(max_length=500, null=True, blank=True)
    
    # Decisions as per data field document
    promotion_recommended_with_increment = models.BooleanField(default=False)
    promotion_recommended_with_pp = models.BooleanField(default=False)
    increment_recommended = models.BooleanField(default=False)
    pay_progression_recommended = models.BooleanField(default=False)
    promotion_increment_pp_deferred = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.get_reviewer_role_display()} Review for {self.appraisal.employee.employee_name}"
