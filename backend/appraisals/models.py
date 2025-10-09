from django.db import models
from datetime import date
from system.models import Employee


# -------------------------
# Timer Models
# -------------------------

from django.db import models
from datetime import date # Assuming date is imported from datetime
# Assuming Employee is imported from system.models or similar

class EmployeeAppraisalTimer(models.Model):
    """
    Defines the period for Employee self-appraisal submission.
    """
    # <<< TEMPORARILY ADDED: null=True, blank=True >>>
    employee_id = models.ForeignKey(
        Employee, 
        on_delete=models.PROTECT,
        null=True,  
        blank=True  
    )
    
    employee_self_appraisal_start = models.DateField(null=True, blank=True)
    employee_self_appraisal_end = models.DateField(null=True, blank=True)
    employee_self_appraisal_remind = models.DateField(null=True, blank=True)

    class Meta:
        verbose_name_plural = "1. Employee Appraisal Timers"

    def is_active_period(self):
        today = date.today()
        return (
            self.employee_self_appraisal_start is not None
            and self.employee_self_appraisal_end is not None
            and self.employee_self_appraisal_start <= today <= self.employee_self_appraisal_end
        )

    def __str__(self):
        return f"Employee Appraisal Timer ({self.employee_self_appraisal_start} - {self.employee_self_appraisal_end})"

class ReportingManagerAppraisalTimer(models.Model):
    """
    Defines the period for Reporting Manager reviews.
    """
    reporting_manager_review_start = models.DateField(null=True, blank=True)
    reporting_manager_review_end = models.DateField(null=True, blank=True)
    reporting_manager_review_remind = models.DateField(null=True, blank=True)

    class Meta:
        verbose_name_plural = "2. Reporting Manager Appraisal Timers"

    def is_active_period(self):
        today = date.today()
        return (
            self.reporting_manager_review_start is not None
            and self.reporting_manager_review_end is not None
            and self.reporting_manager_review_start <= today <= self.reporting_manager_review_end
        )

    def __str__(self):
        return f"RM Appraisal Timer ({self.reporting_manager_review_start} - {self.reporting_manager_review_end})"


class FinalReviewerAppraisalTimer(models.Model):
    """
    Defines the period for higher-level reviewers (HOD, COO, CEO, HR).
    """
    final_review_start = models.DateField(null=True, blank=True)
    final_review_end = models.DateField(null=True, blank=True)
    final_review_remind = models.DateField(null=True, blank=True)

    class Meta:
        verbose_name_plural = "3. Final Reviewer Appraisal Timers"

    def is_active_period(self):
        today = date.today()
        return (
            self.final_review_start is not None
            and self.final_review_end is not None
            and self.final_review_start <= today <= self.final_review_end
        )

    def __str__(self):
        return f"Reviewer Appraisal Timer ({self.final_review_start} - {self.final_review_end})"


# -------------------------
# Self Appraisal & Supporting Models
# -------------------------

class EmployeeAppraisal(models.Model):
    """
    Appraisal form filled out by the employee.
    
    The review period is now linked to the AppraisalTimer model.
    """
    appraisal_id = models.AutoField(primary_key=True)
    employee = models.ForeignKey(Employee, on_delete=models.PROTECT, related_name='self_appraisals')
    
    appraisal_submitted_date = models.DateField(auto_now_add=True)
    
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
        return f"Self-Appraisal for {self.employee.name}"

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
        return f"Attendance for {self.employee.name}"

class SalaryVariance(models.Model):
    """
    Model for salary and promotion recommendations, used in the HR review.
    """
    recommendation_id = models.AutoField(primary_key=True)
    employee = models.ForeignKey(Employee, on_delete=models.PROTECT, related_name='salary_recommendations')
    
    # Use DecimalField for financial calculations to avoid floating point inaccuracies
    current_basic = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    current_gross = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    proposed_basic = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    proposed_gross = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    gross_difference = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    # Recommendation status
    PROMOTION_INCREMENT = 'Promotion with Increment'
    PROMOTION_PP_ONLY = 'Promotion with PP only'
    INCREMENT_NO_PROMO = 'Increment without Promotion'
    PAY_PROGRESSION_ONLY = 'Only Pay Progression (PP) Recommended'
    DEFERRED = 'Promotion/Increment/PP Deferred'
    RECOMMENDATION_CHOICES = [
        (PROMOTION_INCREMENT, 'Promotion Recommended with Increment'),
        (PROMOTION_PP_ONLY, 'Promotion Recommended with PP only'),
        (INCREMENT_NO_PROMO, 'Increment Recommended without Promotion'),
        (PAY_PROGRESSION_ONLY, 'Only Pay Progression (PP) Recommended'),
        (DEFERRED, 'Promotion/Increment/PP Deferred'),
    ]
    
    recommendation = models.CharField(max_length=100, choices=RECOMMENDATION_CHOICES, blank=True)
    
    def save(self, *args, **kwargs):
        # Calculation should be done here before saving the model instance
        if self.current_basic is not None:
            self.current_gross = self.current_basic / 0.55
        
        if self.proposed_basic is not None:
            self.proposed_gross = self.proposed_basic / 0.55
            
        if self.proposed_gross is not None and self.current_gross is not None:
            self.gross_difference = self.proposed_gross - self.current_gross
            
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"Salary Recommendation for {self.employee.name}"

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
        return f"Manager Review for {self.appraisal.employee.name}"

class HRReview(models.Model):
    """
    Review form for HR, linking to Salary and Attendance models.
    """
    appraisal = models.OneToOneField(EmployeeAppraisal, on_delete=models.PROTECT, related_name='hr_review')
    reviewer = models.ForeignKey(Employee, on_delete=models.PROTECT, related_name='hr_appraisals')
    remarks = models.TextField(max_length=1000, null=True, blank=True)
    attendance_summary = models.ForeignKey(AttendanceSummary, on_delete=models.SET_NULL, null=True, blank=True, related_name='hr_reviews')
    salary_recommendation = models.OneToOneField(SalaryVariance, on_delete=models.SET_NULL, null=True, blank=True, related_name='hr_reviews')
    
    # Decisions as per data field document
    promotion_recommended_with_increment = models.BooleanField(default=False)
    promotion_recommended_with_pp = models.BooleanField(default=False)
    increment_recommended = models.BooleanField(default=False)
    pay_progression_recommended = models.BooleanField(default=False)
    promotion_increment_pp_deferred = models.BooleanField(default=False)
    
    decision_remarks = models.TextField(max_length=500, null=True, blank=True)
    
    def __str__(self):
        return f"HR Review for {self.appraisal.employee.name}"

class FinalReview(models.Model):
    """
    A single model for HOD, COO, and CEO reviews, as the form is the same.
    """
    REVIEWER_ROLES = [
        ('hod', 'HOD'),
        ('coo', 'COO'),
        ('ceo', 'CEO'),
    ]
    
    
    PROMOTION_INCREMENT = 'Promotion with Increment'
    PROMOTION_PP_ONLY = 'Promotion with PP only'
    INCREMENT_NO_PROMO = 'Increment without Promotion'
    PAY_PROGRESSION_ONLY = 'Only Pay Progression (PP) Recommended'
    DEFERRED = 'Promotion/Increment/PP Deferred'
    
    RECOMMENDATION_CHOICES = [
    (PROMOTION_INCREMENT, 'Promotion Recommended with Increment'),
    (PROMOTION_PP_ONLY, 'Promotion Recommended with PP only'),
    (INCREMENT_NO_PROMO, 'Increment Recommended without Promotion'),
    (PAY_PROGRESSION_ONLY, 'Only Pay Progression (PP) Recommended'),
    (DEFERRED, 'Promotion/Increment/PP Deferred'),
]

    appraisal = models.ForeignKey(EmployeeAppraisal, on_delete=models.PROTECT, related_name='final_reviews')
    reviewer = models.ForeignKey(Employee, on_delete=models.PROTECT, related_name='final_review_appraisals')
    reviewer_role = models.CharField(max_length=10, choices=REVIEWER_ROLES)
    agreement_remarks = models.TextField(max_length=1000, null=True, blank=True)
    decision_remarks = models.TextField(max_length=500, null=True, blank=True)
    
    # Decisions as per data field document
    decision = models.CharField(max_length=100, choices=RECOMMENDATION_CHOICES, blank=True)
    
    def __str__(self):
        return f"{self.get_reviewer_role_display()} Review for {self.appraisal.employee.name}"


# -------------------------
# Tracking Models
# -------------------------

class EmployeeAppraisalTrack(models.Model):
    """
    Tracks appraisal progress for each employee.
    """
    employee = models.OneToOneField(Employee, on_delete=models.CASCADE, related_name='appraisal_track')
    last_updated = models.DateTimeField(auto_now=True)
    
    # New boolean fields to track completion of each phase
    # Set to null to represent 'not applicable' or 'not started'
    self_appraisal_done = models.CharField(max_length=10, default="NA")
    rm_review_done = models.CharField(max_length=10, default="NA")
    hr_review_done = models.CharField(max_length=10, default="NA")
    hod_review_done = models.CharField(max_length=10, default="NA")
    coo_review_done = models.CharField(max_length=10, default="NA")
    ceo_review_done = models.CharField(max_length=10, default="NA")

    def __str__(self):
        return f"Appraisal Track - {self.employee.name})"


class ReportingManagerAppraisalTrack(models.Model):
    """
    Tracks overall review progress of a Reporting Manager across supervisees.
    """
    STATUS_CHOICES = [
        ('not_started', 'Not Started'),
        ('in_progress', 'In Progress'),
        ('submitted', 'All Reviews Submitted'),
    ]
    reporting_manager = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='manager_appraisal_tracks')
    appraisal_cycle = models.ForeignKey(ReportingManagerAppraisalTimer, on_delete=models.CASCADE, related_name='manager_tracks')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='not_started')
    progress_count = models.IntegerField(default=0)
    total_count = models.IntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('reporting_manager', 'appraisal_cycle')
        ordering = ['-updated_at']

    def update_status(self):
        if self.progress_count == 0:
            self.status = 'not_started'
        elif 0 < self.progress_count < self.total_count:
            self.status = 'in_progress'
        elif self.progress_count >= self.total_count:
            self.status = 'submitted'
        self.save()

    def __str__(self):
        return f"RM Track - {self.reporting_manager} ({self.status}, {self.progress_count}/{self.total_count})"
