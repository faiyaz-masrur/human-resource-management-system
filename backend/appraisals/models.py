from django.db import models
from datetime import date
from system.models import Employee
from django.core.exceptions import ValidationError
from django.core.exceptions import ObjectDoesNotExist


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


class EmployeeAppraisal(models.Model):
    """
    Appraisal form filled out by the employee.
    
    The review period is now linked to the AppraisalTimer model.
    """
    appraisal_id = models.AutoField(primary_key=True)
    employee = models.ForeignKey(Employee, on_delete=models.PROTECT, related_name='self_appraisals')
    
    appraisal_month_year = models.DateField(auto_now_add=True)
    
    achievements_goal_completion = models.TextField(max_length=1000)
    training_development_plan = models.TextField(max_length=1000)
    training_needs = models.TextField(max_length=500)
    
    # Fields to handle the multiple choice options
    soft_skills_training = models.BooleanField(default=False)
    business_training = models.BooleanField(default=False)
    technical_training = models.BooleanField(default=False)   
        
    def __str__(self):
        return f"Self-Appraisal for {self.employee.name}"
    

class ReportingManagerReview(models.Model):
    """
    Review form for the Reporting Manager (RM). Uses 'rm_' prefix for all fields 
    for clarity and uses OneToOneField to ensure only one review per appraisal.
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

    appraisal = models.OneToOneField(
        EmployeeAppraisal, 
        on_delete=models.PROTECT, 
        related_name='manager_review',
        verbose_name='Employee Appraisal'
    )
    reviewer = models.ForeignKey(
        Employee, 
        on_delete=models.PROTECT, 
        related_name='manager_appraisals',
        verbose_name='Reporting Manager'
    )
    
    # --- Remarks Fields (Max 500 words for sections 1-3) ---
    rm_achievements_remarks = models.TextField(
        max_length=500, 
        null=True, 
        blank=True, 
        verbose_name='Achievements/Goal Completion Remarks'
    )
    rm_training_remarks = models.TextField(
        max_length=500, 
        null=True, 
        blank=True, 
        verbose_name='Training and Development Plan Remarks'
    )
    
    # --- Overall Performance Rating ---
    rm_overall_performance_rating = models.CharField(
        max_length=50, 
        choices=OVERALL_PERFORMANCE_RATING_CHOICES, 
        null=True, 
        blank=True,
        verbose_name='Overall Performance Rating'
    )
    rm_justify_overall_rating = models.TextField(
        max_length=500, 
        null=True, 
        blank=True,
        verbose_name='Justification for Overall Rating' 
    )
    
    # --- Potential Rating ---
    rm_potential_rating = models.CharField(
        max_length=50, 
        choices=POTENTIAL_RATING_CHOICES,
        null=True, 
        blank=True,
        verbose_name='Potential Rating'
    )
    
    # --- Final Remarks (Max 1000 words) ---
    rm_final_remarks = models.TextField(
        max_length=1000, 
        null=True, 
        blank=True,
        verbose_name='Final Remarks on Decision/Potential' 
    )
    
    def __str__(self):
        return f"Manager Review for {self.appraisal.employee.name}"


class AttendanceSummary(models.Model):
    """
    Summary of employee attendance and leave usage for the appraisal period.
    """
    summary_id = models.AutoField(primary_key=True)
    employee = models.ForeignKey(Employee, on_delete=models.PROTECT, related_name='attendance_summaries')
    
    # --- Leave Details ---
    casual_leave_taken = models.IntegerField(default=0, verbose_name='Casual Leave Taken')
    sick_leave_taken = models.IntegerField(default=0, verbose_name='Sick Leave Taken')
    annual_leave_taken = models.IntegerField(default=0, verbose_name='Annual Leave Taken')
    
    # Added explicit field to store the calculated total
    total_leave_taken = models.IntegerField(default=0, verbose_name='Total Leave Taken') 
    
    # --- Attendance Details ---
    on_time_count = models.IntegerField(default=0, verbose_name='On Time Count')
    delay_count = models.IntegerField(default=0, verbose_name='Delay Count')
    early_exit_count = models.IntegerField(default=0, verbose_name='Early Exit Count')
        
    def save(self, *args, **kwargs):
        # CORRECTED: Includes all three leave types for total calculation
        self.total_leave_taken = self.casual_leave_taken + self.sick_leave_taken + self.annual_leave_taken

        super().save(*args, **kwargs)

    def __str__(self):
        return f"Attendance Summary for {self.employee.name}"

class SalaryRecommendation(models.Model):
    """
    Stores current salary details and proposed salary adjustments 
    under different recommendation scenarios.
    """
    recommendation_id = models.AutoField(primary_key=True)
    employee = models.ForeignKey(Employee, on_delete=models.PROTECT, related_name='salary_recommendations')
    
    current_basic = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    current_gross = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    # --- Promotion with Increment ---
    promo_with_increment_proposed_basic = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    promo_with_increment_proposed_gross = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    promo_with_increment_gross_difference = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    # --- Promotion without Increment (Implied Pay Progression/PP) ---
    promo_without_increment_proposed_basic = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    promo_without_increment_proposed_gross = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    promo_without_increment_gross_difference = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    # --- Increment (without promotion) ---
    increment_proposed_basic = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    increment_proposed_gross = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    increment_gross_difference = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    # --- Pay Progression (PP) Only ---
    pp_proposed_basic = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    pp_proposed_gross = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    pp_gross_difference = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    def calculate_variance(self):
        """Calculates Gross Salary and Gross Difference for all scenarios."""

        FACTOR = 0.55 # Assuming Gross = Basic / FACTOR
        
        # Current salary
        if self.current_basic is not None:
            self.current_gross = self.current_basic / FACTOR
        
        # Promotion with Increment
        if self.promo_with_increment_proposed_basic is not None:
            self.promo_with_increment_proposed_gross = self.promo_with_increment_proposed_basic / FACTOR
            # CORRECTED: using the actual model field name
            self.promo_with_increment_gross_difference = self.promo_with_increment_proposed_gross - self.current_gross
        
        # Promotion without Increment
        if self.promo_without_increment_proposed_basic is not None:
            self.promo_without_increment_proposed_gross = self.promo_without_increment_proposed_basic / FACTOR
            # CORRECTED: using the actual model field name
            self.promo_without_increment_gross_difference = self.promo_without_increment_proposed_gross - self.current_gross
            
        # Increment (without promotion)
        if self.increment_proposed_basic is not None:
            self.increment_proposed_gross = self.increment_proposed_basic / FACTOR
            self.increment_gross_difference = self.increment_proposed_gross - self.current_gross

        # Pay Progression (PP) Only
        if self.pp_proposed_basic is not None:
            # CORRECTED: Assuming the Gross calculation should be consistent (Basic / FACTOR)
            self.pp_proposed_gross = self.pp_proposed_basic / FACTOR
            self.pp_gross_difference = self.pp_proposed_gross - self.current_gross

    def save(self, *args, **kwargs):
        self.calculate_variance() # Calculate differences before saving
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Salary Recommendation for {self.employee.name}"


# --- Shared Decision Logic ---

DECISION_SUFFIXES = [
    ('Promotion with Increment', 'promo_w_increment_yes', 'promo_w_increment_no'),
    ('Promotion with PP only', 'promo_w_pp_only_yes', 'promo_w_pp_only_no'), # Changed 'hr_promo_w_pp_yes' to 'promo_w_pp_only_yes' for consistency across all models
    ('Increment without Promotion', 'increment_w_no_promo_yes', 'increment_w_no_promo_no'),
    ('Only Pay Progression (PP)', 'pp_only_yes', 'pp_only_no'),
    ('Promotion/Increment/PP Deferred', 'deferred_yes', 'deferred_no'),
]

def _validate_review_decisions(instance, prefix):
    """
    Custom validation logic to ensure that for each decision pair,
    exactly one of YES or NO is True, preventing (True, True) or (False, False).
    """
    errors = {}
    
    for name, yes_suffix, no_suffix in DECISION_SUFFIXES:
        yes_attr = f'{prefix}_{yes_suffix}'
        no_attr = f'{prefix}_{no_suffix}'

        try:
            yes = getattr(instance, yes_attr)
            no = getattr(instance, no_attr)
            
            if yes == no:
                error_message = f"A decision must be explicitly made ('Yes' or 'No') for '{name}'. It cannot be unanswered or ambiguous."
                errors[yes_attr] = error_message
                errors[no_attr] = error_message
        except AttributeError:
            # This handles cases where a model might be missing a decision pair, 
            # though all provided models seem complete.
            print(f"Validation Error: Decision pair attributes {yes_attr} or {no_attr} not found on instance.")


    if errors:
        raise ValidationError(errors)

# -------------------------
# Reviewer Models
# -------------------------


class HrReview(models.Model):

    appraisal = models.OneToOneField(EmployeeAppraisal, on_delete=models.PROTECT, related_name='hr_review')
    reviewer = models.ForeignKey(Employee, on_delete=models.PROTECT, related_name='hr_appraisals')
    
    # --- Remarks ---
    remarks_hr = models.TextField(max_length=1000, null=True, blank=True, verbose_name='Remarks from Human Resource')
    
    # --- Linked Data ---
    attendance_summary = models.ForeignKey(AttendanceSummary, on_delete=models.SET_NULL, null=True, blank=True, related_name='hr_reviews')
    salary_recommendation = models.OneToOneField(SalaryRecommendation, on_delete=models.SET_NULL, null=True, blank=True, related_name='hr_reviews')
    
    # --- Decisions (Checkboxes) ---
    
    # 1. Promotion Recommended with Increment
    hr_promo_w_increment_yes = models.BooleanField(default=False, verbose_name='Promo w/ Increment (Yes)')
    hr_promo_w_increment_no = models.BooleanField(default=False, verbose_name='Promo w/ Increment (No)')
    hr_promo_w_increment_remarks = models.TextField(max_length=500, null=True, blank=True)

    # 2. Promotion Recommended with PP only
    hr_promo_w_pp_yes = models.BooleanField(default=False, verbose_name='Promotion Recommended with PP only (Yes)')
    hr_promo_w_pp_no = models.BooleanField(default=False, verbose_name='Promotion Recommended with PP only (No)')
    hr_promo_w_pp_remarks = models.TextField(max_length=500, null=True, blank=True)

    # 3. Increment Recommended without Promotion
    hr_increment_w_no_promo_yes = models.BooleanField(default=False, verbose_name='Increment w/o Promo (Yes)')
    hr_increment_w_no_promo_no = models.BooleanField(default=False, verbose_name='Increment w/o Promo (No)')
    hr_increment_w_no_promo_remarks = models.TextField(max_length=500, null=True, blank=True)

    # 4. Only Pay Progression (PP) Recommended
    hr_pp_only_yes = models.BooleanField(default=False, verbose_name='PP Only (Yes)')
    hr_pp_only_no = models.BooleanField(default=False, verbose_name='PP Only (No)')
    hr_pp_only_remarks = models.TextField(max_length=500, null=True, blank=True)

    # 5. Promotion/Increment/PP Deferred
    hr_deferred_yes = models.BooleanField(default=False, verbose_name='Deferred (Yes)')
    hr_deferred_no = models.BooleanField(default=False, verbose_name='Deferred (No)')
    hr_deferred_remarks = models.TextField(max_length=500, null=True, blank=True)
    
    # --- Final Decision Remarks ---
    remarks_on_your_decision = models.TextField(max_length=500, null=True, blank=True)
    
    def clean(self):
        """
        Custom validation to ensure exactly one of Yes or No is True for each decision.
        """
        # Note: Using the actual field attribute names here for easy use with getattr (or direct check)
        decision_fields = [
            ('Promotion with Increment', self.hr_promo_w_increment_yes, self.hr_promo_w_increment_no, 'hr_promo_w_increment_yes', 'hr_promo_w_increment_no'),
            ('Promotion with PP only', self.hr_promo_w_pp_yes, self.hr_promo_w_pp_no, 'hr_promo_w_pp_yes', 'hr_promo_w_pp_no'),
            ('Increment without Promotion', self.hr_increment_w_no_promo_yes, self.hr_increment_w_no_promo_no, 'hr_increment_w_no_promo_yes', 'hr_increment_w_no_promo_no'),
            ('Only Pay Progression (PP)', self.hr_pp_only_yes, self.hr_pp_only_no, 'hr_pp_only_yes', 'hr_pp_only_no'),
            ('Promotion/Increment/PP Deferred', self.hr_deferred_yes, self.hr_deferred_no, 'hr_deferred_yes', 'hr_deferred_no'),
        ]
        
        errors = {}
        # name is for display, yes/no are values, yes_field/no_field are attribute names
        for name, yes, no, yes_field, no_field in decision_fields:
            # Enforces that (yes XOR no) is True, preventing (True AND True) and (False AND False)
            if yes == no:
                error_message = f"A decision must be explicitly made ('Yes' or 'No') for '{name}'. It cannot be unanswered or ambiguous."
                errors[yes_field] = error_message
                errors[no_field] = error_message

        if errors:
            # Raise the ValidationError using the field names
            raise ValidationError(errors)

    def save(self, *args, **kwargs):
        # Always run full validation before saving
        self.full_clean() 
        super().save(*args, **kwargs)

    def __str__(self):
        return f"HR Review for {self.appraisal.employee.name}"


DECISION_SUFFIXES = [
    ('Promotion with Increment', 'promo_w_increment_yes', 'promo_w_increment_no'),
    ('Promotion with PP only', 'promo_w_pp_only_yes', 'promo_w_pp_only_no'),
    ('Increment without Promotion', 'increment_w_no_promo_yes', 'increment_w_no_promo_no'),
    ('Only Pay Progression (PP)', 'pp_only_yes', 'pp_only_no'),
    ('Promotion/Increment/PP Deferred', 'deferred_yes', 'deferred_no'),
]

# --- Shared Validation Logic ---

def _validate_review_decisions(instance, prefix):
    """
    Custom validation logic to ensure that for each decision pair,
    exactly one of YES or NO is True, preventing (True, True) or (False, False).
    It dynamically constructs the attribute names using the provided prefix.
    """
    errors = {}
    
    for name, yes_suffix, no_suffix in DECISION_SUFFIXES:
        yes_attr = f'{prefix}_{yes_suffix}'
        no_attr = f'{prefix}_{no_suffix}'

        # Use getattr to fetch the dynamic field values
        yes = getattr(instance, yes_attr)
        no = getattr(instance, no_attr)
        
        if yes == no:
            # This condition catches both (True, True) -> Ambiguous AND (False, False) -> Unanswered
            error_message = f"A decision must be explicitly made ('Yes' or 'No') for '{name}'. It cannot be unanswered or ambiguous."
            
            # Apply error to the specific fields for better form handling
            if yes: # Ambiguous (True, True)
                errors[yes_attr] = error_message
                errors[no_attr] = error_message
            else: # Unanswered (False, False)
                errors[yes_attr] = error_message
                errors[no_attr] = error_message

    if errors:
        raise ValidationError(errors)

# --- 1. Head of Department (HOD) Review Model ---

class HodReview(models.Model):
    """
    The specific model for the Head of Department's final review.
    Uses OneToOneField to ensure only one HOD review per appraisal.
    """
    appraisal = models.OneToOneField(
        EmployeeAppraisal, 
        on_delete=models.PROTECT, 
        related_name='hod_review',
        verbose_name='Employee Appraisal'
    )
    reviewer = models.ForeignKey(
        Employee, 
        on_delete=models.PROTECT, 
        related_name='hod_appraisals',
        verbose_name='HOD Reviewer'
    )
    
    # --- Remarks ---
    remarks = models.TextField(max_length=1000, null=True, blank=True, verbose_name='General Remarks (HOD)')

    # --- Decisions (Explicit Yes/No BooleanFields with Remarks) ---

    # 1. Promotion Recommended with Increment
    hod_promo_w_increment_yes = models.BooleanField(default=False, verbose_name='Promo w/ Increment (Yes)')
    hod_promo_w_increment_no = models.BooleanField(default=False, verbose_name='Promo w/ Increment (No)')
    hod_promo_w_increment_remarks = models.TextField(max_length=500, null=True, blank=True)

    # 2. Promotion Recommended with PP only
    hod_promo_w_pp_only_yes = models.BooleanField(default=False, verbose_name='Promo w/ PP Only (Yes)')
    hod_promo_w_pp_only_no = models.BooleanField(default=False, verbose_name='Promo w/ PP Only (No)')
    hod_promo_w_pp_only_remarks = models.TextField(max_length=500, null=True, blank=True)

    # 3. Increment Recommended without Promotion
    hod_increment_w_no_promo_yes = models.BooleanField(default=False, verbose_name='Increment w/o Promo (Yes)')
    hod_increment_w_no_promo_no = models.BooleanField(default=False, verbose_name='Increment w/o Promo (No)')
    hod_increment_w_no_promo_remarks = models.TextField(max_length=500, null=True, blank=True)

    # 4. Only Pay Progression (PP) Recommended
    hod_pp_only_yes = models.BooleanField(default=False, verbose_name='PP Only (Yes)')
    hod_pp_only_no = models.BooleanField(default=False, verbose_name='PP Only (No)')
    hod_pp_only_remarks = models.TextField(max_length=500, null=True, blank=True)

    # 5. Promotion/Increment/PP Deferred
    hod_deferred_yes = models.BooleanField(default=False, verbose_name='Deferred (Yes)')
    hod_deferred_no = models.BooleanField(default=False, verbose_name='Deferred (No)')
    hod_deferred_remarks = models.TextField(max_length=500, null=True, blank=True)
    
    # --- Final Remarks on the decision ---
    remarks_on_decision = models.TextField(max_length=500, null=True, blank=True, verbose_name='Final Decision Remarks (HOD)')
    
    def clean(self):
        # Run the shared validation logic with the HOD prefix
        _validate_review_decisions(self, 'hod')
            
    def save(self, *args, **kwargs):
        self.full_clean() 
        super().save(*args, **kwargs)

    def __str__(self):
        return f"HOD Review for {self.appraisal.employee.name}"

# --- 2. Chief Operating Officer (COO) Review Model ---

class CooReview(models.Model):
    """
    The specific model for the Chief Operating Officer's final review.
    Uses OneToOneField to ensure only one COO review per appraisal.
    """
    appraisal = models.OneToOneField(
        EmployeeAppraisal, 
        on_delete=models.PROTECT, 
        related_name='coo_review',
        verbose_name='Employee Appraisal'
    )
    reviewer = models.ForeignKey(
        Employee, 
        on_delete=models.PROTECT, 
        related_name='coo_appraisals',
        verbose_name='COO Reviewer'
    )
    
    # --- Remarks ---
    remarks = models.TextField(max_length=1000, null=True, blank=True, verbose_name='General Remarks (COO)')

    # --- Decisions (Identical fields as HOD/CEO) ---
    coo_promo_w_increment_yes = models.BooleanField(default=False, verbose_name='Promo w/ Increment (Yes)')
    coo_promo_w_increment_no = models.BooleanField(default=False, verbose_name='Promo w/ Increment (No)')
    coo_promo_w_increment_remarks = models.TextField(max_length=500, null=True, blank=True)

    coo_promo_w_pp_only_yes = models.BooleanField(default=False, verbose_name='Promo w/ PP Only (Yes)')
    coo_promo_w_pp_only_no = models.BooleanField(default=False, verbose_name='Promo w/ PP Only (No)')
    coo_promo_w_pp_only_remarks = models.TextField(max_length=500, null=True, blank=True)

    coo_increment_w_no_promo_yes = models.BooleanField(default=False, verbose_name='Increment w/o Promo (Yes)')
    coo_increment_w_no_promo_no = models.BooleanField(default=False, verbose_name='Increment w/o Promo (No)')
    coo_increment_w_no_promo_remarks = models.TextField(max_length=500, null=True, blank=True)

    coo_pp_only_yes = models.BooleanField(default=False, verbose_name='PP Only (Yes)')
    coo_pp_only_no = models.BooleanField(default=False, verbose_name='PP Only (No)')
    coo_pp_only_remarks = models.TextField(max_length=500, null=True, blank=True)

    coo_deferred_yes = models.BooleanField(default=False, verbose_name='Deferred (Yes)')
    coo_deferred_no = models.BooleanField(default=False, verbose_name='Deferred (No)')
    coo_deferred_remarks = models.TextField(max_length=500, null=True, blank=True)
    
    # --- Final Remarks on the decision ---
    remarks_on_decision = models.TextField(max_length=500, null=True, blank=True, verbose_name='Final Decision Remarks (COO)')
    
    def clean(self):
        # Run the shared validation logic with the COO prefix
        _validate_review_decisions(self, 'coo')
            
    def save(self, *args, **kwargs):
        self.full_clean() 
        super().save(*args, **kwargs)

    def __str__(self):
        return f"COO Review for {self.appraisal.employee.name}"

# --- 3. Chief Executive Officer (CEO) Review Model ---

class CeoReview(models.Model):
    """
    The specific model for the Chief Executive Officer's final review.
    Uses OneToOneField to ensure only one CEO review per appraisal.
    """
    appraisal = models.OneToOneField(
        EmployeeAppraisal, 
        on_delete=models.PROTECT, 
        related_name='ceo_review',
        verbose_name='Employee Appraisal'
    )
    reviewer = models.ForeignKey(
        Employee, 
        on_delete=models.PROTECT, 
        related_name='ceo_appraisals',
        verbose_name='CEO Reviewer'
    )
    
    # --- Remarks ---
    remarks = models.TextField(max_length=1000, null=True, blank=True, verbose_name='General Remarks (CEO)')

    # --- Decisions (Identical fields as HOD/COO) ---
    ceo_promo_w_increment_yes = models.BooleanField(default=False, verbose_name='Promo w/ Increment (Yes)')
    ceo_promo_w_increment_no = models.BooleanField(default=False, verbose_name='Promo w/ Increment (No)')
    ceo_promo_w_increment_remarks = models.TextField(max_length=500, null=True, blank=True)

    ceo_promo_w_pp_only_yes = models.BooleanField(default=False, verbose_name='Promo w/ PP Only (Yes)')
    ceo_promo_w_pp_only_no = models.BooleanField(default=False, verbose_name='Promo w/ PP Only (No)')
    ceo_promo_w_pp_only_remarks = models.TextField(max_length=500, null=True, blank=True)

    ceo_increment_w_no_promo_yes = models.BooleanField(default=False, verbose_name='Increment w/o Promo (Yes)')
    ceo_increment_w_no_promo_no = models.BooleanField(default=False, verbose_name='Increment w/o Promo (No)')
    ceo_increment_w_no_promo_remarks = models.TextField(max_length=500, null=True, blank=True)

    ceo_pp_only_yes = models.BooleanField(default=False, verbose_name='PP Only (Yes)')
    ceo_pp_only_no = models.BooleanField(default=False, verbose_name='PP Only (No)')
    ceo_pp_only_remarks = models.TextField(max_length=500, null=True, blank=True)

    ceo_deferred_yes = models.BooleanField(default=False, verbose_name='Deferred (Yes)')
    ceo_deferred_no = models.BooleanField(default=False, verbose_name='Deferred (No)')
    ceo_deferred_remarks = models.TextField(max_length=500, null=True, blank=True)
    
    # --- Final Remarks on the decision ---
    remarks_on_decision = models.TextField(max_length=500, null=True, blank=True, verbose_name='Final Decision Remarks (CEO)')
    
    def clean(self):
        # Run the shared validation logic with the CEO prefix
        _validate_review_decisions(self, 'ceo')
            
    def save(self, *args, **kwargs):
        self.full_clean() 
        super().save(*args, **kwargs)

    def __str__(self):
        return f"CEO Review for {self.appraisal.employee.name}"



# -------------------------
# Tracking Models
# -------------------------

class EmployeeAppraisalStatusTrack(models.Model):
    """
    Tracks appraisal progress for each employee based on submitted appraisals 
    (for self-appraisal) and required reviews (for subsequent steps).
    """
    employee = models.OneToOneField(Employee, on_delete=models.CASCADE, related_name='appraisal_track')
    last_updated = models.DateTimeField(auto_now=True)
    
    # NOTE: null=True, blank=True allow setting these fields to None (SQL NULL)
    self_appraisal_done = models.CharField(max_length=10, default="NA", null=True, blank=True)
    rm_review_done = models.CharField(max_length=10, default="NA", null=True, blank=True)
    hr_review_done = models.CharField(max_length=10, default="NA", null=True, blank=True)
    hod_review_done = models.CharField(max_length=10, default="NA", null=True, blank=True)
    coo_review_done = models.CharField(max_length=10, default="NA", null=True, blank=True)
    ceo_review_done = models.CharField(max_length=10, default="NA", null=True, blank=True)

    def save(self, *args, **kwargs):
        """
        Custom save method to set the tracking status.
        
        Logic for Reviewer Appraisals (rm_review_done onwards):
        - If Employee boolean is True (review required) -> Track field = "False" (string, pending)
        - If Employee boolean is False (review not required) -> Track field = None (NULL)
        
        Logic for Self-Appraisal (self_appraisal_done):
        - Check if EmployeeAppraisal exists for this employee -> "True" (submitted)
        - If not, -> "False" (not submitted)
        """
        try:
            employee = self.employee
        except ObjectDoesNotExist:
            super().save(*args, **kwargs)
            return

        # --- 1. Logic for Self-Appraisal ---
        try:
            # Check if an EmployeeAppraisal instance exists for this employee.
            # We assume EmployeeAppraisal has a ForeignKey named 'employee'.
            is_self_appraisal_submitted = EmployeeAppraisal.objects.filter(employee=employee).exists()
            
            if is_self_appraisal_submitted:
                self.self_appraisal_done = "True"
            else:
                # Required for every employee, set to "False" if not submitted.
                self.self_appraisal_done = "False" 
                
        except Exception as e:
            # Handle exceptions during the database query (e.g., if model is not defined/imported)
            print(f"ERROR checking EmployeeAppraisal submission: {e}")
            self.self_appraisal_done = "ERROR" # Use a distinct error state if necessary


        # --- 2. Logic for Reviewer Appraisals (Based on Employee flags) ---
        review_mappings = [
            # Removed 'reviewed_by_employee' mapping
            ('reviewed_by_rm', 'rm_review_done'),
            ('reviewed_by_hr', 'hr_review_done'),
            ('reviewed_by_hod', 'hod_review_done'),
            ('reviewed_by_coo', 'coo_review_done'),
            ('reviewed_by_ceo', 'ceo_review_done'),
        ]
        
        for employee_attr, track_attr in review_mappings:
            try:
                # Safely get the boolean value from the Employee model, defaulting to False
                is_review_required = getattr(employee, employee_attr, False) 
                
                if is_review_required:
                    # If required, set the field to the string "False" (Pending)
                    setattr(self, track_attr, "False")
                else:
                    # If not required, set the field to None (NULL)
                    setattr(self, track_attr, None) 
                    
            except AttributeError:
                print(f"ERROR: Employee model is missing expected attribute: {employee_attr}")
                setattr(self, track_attr, "MISSING_FIELD")

        super().save(*args, **kwargs)

    def __str__(self):
        return f"Appraisal Status - {self.employee.name})"



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
