from django.db import models
from datetime import date
from system.models import Employee, ReportingManager


# -------------------------
# Timer Models
# -------------------------

from django.db import models
from datetime import date 

class EmployeeAppraisalTimer(models.Model):

    employee = models.OneToOneField(
        Employee, 
        on_delete=models.CASCADE,
        related_name='appraisal_timers'
    )
    
    employee_self_appraisal_start = models.DateField(null=True, blank=True)
    employee_self_appraisal_end = models.DateField(null=True, blank=True)
    employee_self_appraisal_remind = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"Employee Appraisal Timer ({self.employee_self_appraisal_start} - {self.employee_self_appraisal_end})"

    class Meta:
        verbose_name_plural = "1. Employee Appraisal Timers"



    

# class ReportingManagerAppraisalTimer(models.Model):

#     reporting_manager_review_start = models.DateField(null=True, blank=True)
#     reporting_manager_review_end = models.DateField(null=True, blank=True)
#     reporting_manager_review_remind = models.DateField(null=True, blank=True)

#     class Meta:
#         verbose_name_plural = "2. Reporting Manager Appraisal Timers"

#     def is_active_period(self):
#         today = date.today()
#         return (
#             self.reporting_manager_review_start is not None
#             and self.reporting_manager_review_end is not None
#             and self.reporting_manager_review_start <= today <= self.reporting_manager_review_end
#         )

#     def __str__(self):
#         return f"RM Appraisal Timer ({self.reporting_manager_review_start} - {self.reporting_manager_review_end})"


# class FinalReviewerAppraisalTimer(models.Model):

#     final_review_start = models.DateField(null=True, blank=True)
#     final_review_end = models.DateField(null=True, blank=True)
#     final_review_remind = models.DateField(null=True, blank=True)

#     class Meta:
#         verbose_name_plural = "3. Final Reviewer Appraisal Timers"

#     def is_active_period(self):
#         today = date.today()
#         return (
#             self.final_review_start is not None
#             and self.final_review_end is not None
#             and self.final_review_start <= today <= self.final_review_end
#         )

#     def __str__(self):
#         return f"Reviewer Appraisal Timer ({self.final_review_start} - {self.final_review_end})"

# -------------------------
# Employee Appraisal Model
# -------------------------

class EmployeeAppraisal(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, blank=True, related_name='self_appraisals')

    created_at = models.DateTimeField(auto_now_add=True)
    
    updated_at = models.DateTimeField(auto_now=True)
    
    achievements_goal_completion = models.TextField(max_length=1000)
    training_plan = models.TextField(max_length=1000)
    development_plan = models.TextField(max_length=1000)
    
    soft_skills_training = models.BooleanField(default=False)
    business_training = models.BooleanField(default=False)
    technical_training = models.BooleanField(default=False)   
    training_description = models.TextField(max_length=500)
        
    def __str__(self):
        return f"Self-Appraisal for {self.employee.name}"
    
    class Meta:
        ordering = ['-created_at']

        

# -------------------------
# Rm Review Model
# -------------------------

class ReportingManagerReview(models.Model):

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
        on_delete=models.CASCADE, 
        related_name='rm_review',
    )
    

    achievements_remarks = models.TextField(
        max_length=500, 
        verbose_name='Achievements/Goal Completion Remarks'
    )
    training_remarks = models.TextField(
        max_length=500, 
        verbose_name='Training and Development Plan Remarks'
    )
    overall_performance_rating = models.CharField(
        max_length=50, 
        choices=OVERALL_PERFORMANCE_RATING_CHOICES, 
        verbose_name='Overall Performance Rating'
    )
    justify_overall_rating = models.TextField(
        max_length=500, 
        verbose_name='Justification for Overall Rating' 
    )
    potential_rating = models.CharField(
        max_length=50, 
        choices=POTENTIAL_RATING_CHOICES,
        verbose_name='Potential Rating'
    )
    decision_remarks = models.TextField(
        max_length=1000, 
        null=True, 
        blank=True,
        verbose_name='Final Remarks on Decision/Potential' 
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Manager Review for {self.appraisal.employee.name}"




# -------------------------
# Hr Review Model
# -------------------------


class HrReview(models.Model):

    appraisal = models.OneToOneField(EmployeeAppraisal, on_delete=models.CASCADE, related_name='hr_review')

    remarks_hr = models.TextField(max_length=1000, verbose_name='Remarks from Human Resource')
    
    # --- Leave Details ---
    casual_leave_taken = models.IntegerField(default=0, verbose_name='Casual Leave Taken')
    sick_leave_taken = models.IntegerField(default=0, verbose_name='Sick Leave Taken')
    annual_leave_taken = models.IntegerField(default=0, verbose_name='Annual Leave Taken')

    # --- Attendance Details ---
    on_time_count = models.IntegerField(default=0, verbose_name='On Time Count')
    delay_count = models.IntegerField(default=0, verbose_name='Delay Count')
    early_exit_count = models.IntegerField(default=0, verbose_name='Early Exit Count')

    # --- Advancement Details ---
    current_basic = models.IntegerField(default=0)

    # --- Promotion with Increment ---
    promo_with_increment_proposed_basic = models.IntegerField(default=0)

    # --- Promotion without Increment (Implied Pay Progression/PP) ---
    promo_without_increment_proposed_basic = models.IntegerField(default=0)
    
    # --- Increment (without promotion) ---
    increment_proposed_basic = models.IntegerField(default=0)
    
    # --- Pay Progression (PP) Only ---
    pp_proposed_basic = models.IntegerField(default=0)
    
    # --- Decisions (Checkboxes) ---
    # 1. Promotion Recommended with Increment
    promo_w_increment = models.BooleanField(default=False, verbose_name='Promo with Increment')
    promo_w_increment_remarks = models.TextField(max_length=100, null=True, blank=True)

    # 2. Promotion Recommended with PP only
    promo_w_pp = models.BooleanField(default=False, verbose_name='Promotion Recommended with PP only')
    promo_w_pp_remarks = models.TextField(max_length=100, null=True, blank=True)

    # 3. Increment Recommended without Promotion
    increment_w_no_promo = models.BooleanField(default=False, verbose_name='Increment w/o Promo')
    increment_w_no_promo_remarks = models.TextField(max_length=100, null=True, blank=True)

    # 4. Only Pay Progression (PP) Recommended
    pp_only = models.BooleanField(default=False, verbose_name='PP Only')
    pp_only_remarks = models.TextField(max_length=100, null=True, blank=True)

    # 5. Promotion/Increment/PP Deferred
    deferred = models.BooleanField(default=False, verbose_name='Deferred')
    deferred_remarks = models.TextField(max_length=100, null=True, blank=True)
    
    # --- Final Decision Remarks ---
    remarks_on_your_decision = models.TextField(max_length=500, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True) 
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"HR Review for {self.appraisal.employee.name}"



# -------------------------
# Hod Review Model
# -------------------------

class HodReview(models.Model):

    appraisal = models.OneToOneField(
        EmployeeAppraisal, 
        on_delete=models.CASCADE, 
        related_name='hod_review',
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # --- Remarks ---
    remarks = models.TextField(max_length=1000, verbose_name='General Remarks (HOD)')

    # --- Decisions (Checkboxes) ---
    # 1. Promotion Recommended with Increment
    promo_w_increment = models.BooleanField(default=False, verbose_name='Promo with Increment')
    promo_w_increment_remarks = models.TextField(max_length=100, null=True, blank=True)

    # 2. Promotion Recommended with PP only
    promo_w_pp = models.BooleanField(default=False, verbose_name='Promotion Recommended with PP only')
    promo_w_pp_remarks = models.TextField(max_length=100, null=True, blank=True)

    # 3. Increment Recommended without Promotion
    increment_w_no_promo = models.BooleanField(default=False, verbose_name='Increment w/o Promo')
    increment_w_no_promo_remarks = models.TextField(max_length=100, null=True, blank=True)

    # 4. Only Pay Progression (PP) Recommended
    pp_only = models.BooleanField(default=False, verbose_name='PP Only')
    pp_only_remarks = models.TextField(max_length=100, null=True, blank=True)

    # 5. Promotion/Increment/PP Deferred
    deferred = models.BooleanField(default=False, verbose_name='Deferred')
    deferred_remarks = models.TextField(max_length=100, null=True, blank=True)
    
    # --- Final Remarks on the decision ---
    remarks_on_your_decision = models.TextField(max_length=500, null=True, blank=True, verbose_name='Final Decision Remarks (HOD)')

    def __str__(self):
        return f"HOD Review for {self.appraisal.employee.name}"



# -------------------------
# Coo Review Model
# -------------------------

class CooReview(models.Model):

    appraisal = models.OneToOneField(
        EmployeeAppraisal, 
        on_delete=models.CASCADE, 
        related_name='coo_review',
        verbose_name='Employee Appraisal'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # --- Remarks ---
    remarks = models.TextField(max_length=1000, verbose_name='General Remarks (COO)')

    # --- Decisions (Checkboxes) ---
    # 1. Promotion Recommended with Increment
    promo_w_increment = models.BooleanField(default=False, verbose_name='Promo with Increment')
    promo_w_increment_remarks = models.TextField(max_length=100, null=True, blank=True)

    # 2. Promotion Recommended with PP only
    promo_w_pp = models.BooleanField(default=False, verbose_name='Promotion Recommended with PP only')
    promo_w_pp_remarks = models.TextField(max_length=100, null=True, blank=True)

    # 3. Increment Recommended without Promotion
    increment_w_no_promo = models.BooleanField(default=False, verbose_name='Increment w/o Promo')
    increment_w_no_promo_remarks = models.TextField(max_length=100, null=True, blank=True)

    # 4. Only Pay Progression (PP) Recommended
    pp_only = models.BooleanField(default=False, verbose_name='PP Only')
    pp_only_remarks = models.TextField(max_length=100, null=True, blank=True)

    # 5. Promotion/Increment/PP Deferred
    deferred = models.BooleanField(default=False, verbose_name='Deferred')
    deferred_remarks = models.TextField(max_length=100, null=True, blank=True)
    
    # --- Final Remarks on the decision ---
    remarks_on_your_decision = models.TextField(max_length=500, null=True, blank=True, verbose_name='Final Decision Remarks (COO)')

    def __str__(self):
        return f"COO Review for {self.appraisal.employee.name}"



# -------------------------
# Ceo Review Model
# -------------------------

class CeoReview(models.Model):

    appraisal = models.OneToOneField(
        EmployeeAppraisal, 
        on_delete=models.CASCADE, 
        related_name='ceo_review',
        verbose_name='Employee Appraisal'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # --- Remarks ---
    remarks = models.TextField(max_length=1000, verbose_name='General Remarks (CEO)')

    # --- Decisions (Checkboxes) ---
    # 1. Promotion Recommended with Increment
    promo_w_increment = models.BooleanField(default=False, verbose_name='Promo with Increment')
    promo_w_increment_remarks = models.TextField(max_length=100, null=True, blank=True)

    # 2. Promotion Recommended with PP only
    promo_w_pp = models.BooleanField(default=False, verbose_name='Promotion Recommended with PP only')
    promo_w_pp_remarks = models.TextField(max_length=100, null=True, blank=True)

    # 3. Increment Recommended without Promotion
    increment_w_no_promo = models.BooleanField(default=False, verbose_name='Increment w/o Promo')
    increment_w_no_promo_remarks = models.TextField(max_length=100, null=True, blank=True)

    # 4. Only Pay Progression (PP) Recommended
    pp_only = models.BooleanField(default=False, verbose_name='PP Only')
    pp_only_remarks = models.TextField(max_length=100, null=True, blank=True)

    # 5. Promotion/Increment/PP Deferred
    deferred = models.BooleanField(default=False, verbose_name='Deferred')
    deferred_remarks = models.TextField(max_length=100, null=True, blank=True)
    
    # --- Final Remarks on the decision ---
    remarks_on_your_decision = models.TextField(max_length=500, null=True, blank=True, verbose_name='Final Decision Remarks (CEO)')

    def __str__(self):
        return f"CEO Review for {self.appraisal.employee.name}"





# -------------------------
# Appraisal Status Model
# -------------------------

class EmployeeAppraisalStatus(models.Model):

    STATUS_CHOICES = [
        ('NA', 'NA'),
        ('PENDING', 'PENDING'),
        ('DONE', 'DONE'),
    ]

    employee = models.OneToOneField(Employee, on_delete=models.CASCADE, related_name='employee_appraisal_status')
    appraisal_date = models.DateField(null=True, blank=True)
    
    self_appraisal_done = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDING', null=True, blank=True)
    rm_review_done = models.CharField(max_length=10, choices=STATUS_CHOICES, default="NA", null=True, blank=True)
    hr_review_done = models.CharField(max_length=10, choices=STATUS_CHOICES, default="NA", null=True, blank=True)
    hod_review_done = models.CharField(max_length=10, choices=STATUS_CHOICES, default="NA", null=True, blank=True)
    coo_review_done = models.CharField(max_length=10, choices=STATUS_CHOICES, default="NA", null=True, blank=True)
    ceo_review_done = models.CharField(max_length=10, choices=STATUS_CHOICES, default="NA", null=True, blank=True)

    def __str__(self):
        return f"Appraisal Status - {self.employee.name}"
    




# -------------------------
# Appraisal Details Model
# -------------------------

class AppraisalDetails(models.Model):
    employee = models.OneToOneField(Employee, on_delete=models.CASCADE, related_name='appraisal_details')
    
    # ONLY these fields exist in your database
    emp_appraisal = models.OneToOneField(EmployeeAppraisal, on_delete=models.SET_NULL, null=True, blank=True)
    rm_review = models.OneToOneField(ReportingManagerReview, on_delete=models.SET_NULL, null=True, blank=True)
    hr_review = models.OneToOneField(HrReview, on_delete=models.SET_NULL, null=True, blank=True)
    hod_review = models.OneToOneField(HodReview, on_delete=models.SET_NULL, null=True, blank=True)
    coo_review = models.OneToOneField(CooReview, on_delete=models.SET_NULL, null=True, blank=True)
    ceo_review = models.OneToOneField(CeoReview, on_delete=models.SET_NULL, null=True, blank=True)
    
    appraisal_start_date = models.DateField(null=True, blank=True)
    appraisal_end_date = models.DateField(null=True, blank=True)

    # REMOVE THESE - they don't exist in database:
    # reporting_manager = ...
    # appraisal_status = ...
    # factor = ...

    def __str__(self):
        return f"Appraisal Details for {self.employee.name}"

    def is_in_active_period(self):
        today = date.today()
        return (
            self.appraisal_start_date is not None
            and self.appraisal_end_date is not None
            and self.appraisal_start_date <= today <= self.appraisal_end_date
        )




    


# -------------------------
# Appraisal Backup Model
# -------------------------
    
# class AppraisalDetailsBackup(models.Model):

#     employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='appraisal_details_backups')
#     #reporting_manager = models.ForeignKey(ReportingManager, on_delete=models.SET_NULL, related_name='managed_appraisal_details_backups', null=True, blank=True)
#     emp_appraisal = models.OneToOneField(EmployeeAppraisal, on_delete=models.SET_NULL, related_name='backup_appraisal_detail', null=True, blank=True)
#     rm_review = models.OneToOneField(ReportingManagerReview, on_delete=models.SET_NULL, related_name='backup_appraisal_detail', null=True, blank=True)
#     hr_review = models.OneToOneField(HrReview, on_delete=models.SET_NULL, related_name='backup_appraisal_detail', null=True, blank=True)
#     hod_review = models.OneToOneField(HodReview, on_delete=models.SET_NULL, related_name='backup_appraisal_detail', null=True, blank=True)
#     coo_review = models.OneToOneField(CooReview, on_delete=models.SET_NULL, related_name='backup_appraisal_detail', null=True, blank=True)
#     ceo_review = models.OneToOneField(CeoReview, on_delete=models.SET_NULL, related_name='backup_appraisal_detail', null=True, blank=True)


#     appraisal_start_date = models.DateField(null=True, blank=True, verbose_name='Appraisal Start Date')
#     appraisal_end_date = models.DateField(null=True, blank=True, verbose_name='Appraisal End Date')

#     factor = models.DecimalField(max_digits=10, decimal_places=2, default=0.55)

#     class Meta:
#         verbose_name_plural = "Appraisal Backups"

#     def __str__(self):
#         return f"Backup for {self.employee.name}"





# class ReportingManagerAppraisalTrack(models.Model):

#     STATUS_CHOICES = [
#         ('not_started', 'Not Started'),
#         ('in_progress', 'In Progress'),
#         ('submitted', 'All Reviews Submitted'),
#     ]
#     reporting_manager = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='manager_appraisal_tracks')
#     appraisal_cycle = models.ForeignKey(ReportingManagerAppraisalTimer, on_delete=models.CASCADE, related_name='manager_tracks')
#     status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='not_started')
#     progress_count = models.IntegerField(default=0)
#     total_count = models.IntegerField(default=0)
#     updated_at = models.DateTimeField(auto_now=True)

#     class Meta:
#         unique_together = ('reporting_manager', 'appraisal_cycle')
#         ordering = ['-updated_at']

#     def update_status(self):
#         if self.progress_count == 0:
#             self.status = 'not_started'
#         elif 0 < self.progress_count < self.total_count:
#             self.status = 'in_progress'
#         elif self.progress_count >= self.total_count:
#             self.status = 'submitted'
#         self.save()

#     def __str__(self):
#         return f"RM Track - {self.reporting_manager} ({self.status}, {self.progress_count}/{self.total_count})"

# def clean(self):
#     # Run the shared validation logic with the CEO prefix
#     _validate_review_decisions(self, 'ceo')
        
# def save(self, *args, **kwargs):
#     self.full_clean() 
#     super().save(*args, **kwargs)

# DECISION_SUFFIXES = [
#     ('Promotion with Increment', 'promo_w_increment_yes', 'promo_w_increment_no'),
#     ('Promotion with PP only', 'promo_w_pp_only_yes', 'promo_w_pp_only_no'),
#     ('Increment without Promotion', 'increment_w_no_promo_yes', 'increment_w_no_promo_no'),
#     ('Only Pay Progression (PP)', 'pp_only_yes', 'pp_only_no'),
#     ('Promotion/Increment/PP Deferred', 'deferred_yes', 'deferred_no'),
# ]

# # --- Shared Validation Logic ---

# def _validate_review_decisions(instance, prefix):

#     errors = {}
    
#     for name, yes_suffix, no_suffix in DECISION_SUFFIXES:
#         yes_attr = f'{prefix}_{yes_suffix}'
#         no_attr = f'{prefix}_{no_suffix}'

#         yes = getattr(instance, yes_attr)
#         no = getattr(instance, no_attr)
        
#         if yes == no:
            
#             error_message = f"A decision must be explicitly made ('Yes' or 'No') for '{name}'. It cannot be unanswered or ambiguous."
            
#             if yes: 
#                 errors[yes_attr] = error_message
#                 errors[no_attr] = error_message
#             else: 
#                 errors[yes_attr] = error_message
#                 errors[no_attr] = error_message

#     if errors:
#         raise ValidationError(errors)


# class AttendanceSummary(models.Model):

#     summary_id = models.AutoField(primary_key=True)
#     employee = models.ForeignKey(Employee, on_delete=models.PROTECT, related_name='attendance_summaries')
    
#     # --- Leave Details ---
#     casual_leave_taken = models.IntegerField(default=0, verbose_name='Casual Leave Taken')
#     sick_leave_taken = models.IntegerField(default=0, verbose_name='Sick Leave Taken')
#     annual_leave_taken = models.IntegerField(default=0, verbose_name='Annual Leave Taken')
    
#     # Added explicit field to store the calculated total
#     total_leave_taken = models.IntegerField(default=0, verbose_name='Total Leave Taken') 
    
#     # --- Attendance Details ---
#     on_time_count = models.IntegerField(default=0, verbose_name='On Time Count')
#     delay_count = models.IntegerField(default=0, verbose_name='Delay Count')
#     early_exit_count = models.IntegerField(default=0, verbose_name='Early Exit Count')
        
#     def save(self, *args, **kwargs):
#         self.total_leave_taken = self.casual_leave_taken + self.sick_leave_taken + self.annual_leave_taken

#         super().save(*args, **kwargs)

#     def __str__(self):
#         return f"Attendance Summary for {self.employee.name}"

# class SalaryRecommendation(models.Model):

#     recommendation_id = models.AutoField(primary_key=True)
#     employee = models.ForeignKey(Employee, on_delete=models.PROTECT, related_name='salary_recommendations')
    
#     current_basic = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
#     current_gross = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

#     # --- Promotion with Increment ---
#     promo_with_increment_proposed_basic = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
#     promo_with_increment_proposed_gross = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
#     promo_with_increment_gross_difference = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

#     # --- Promotion without Increment (Implied Pay Progression/PP) ---
#     promo_without_increment_proposed_basic = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
#     promo_without_increment_proposed_gross = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
#     promo_without_increment_gross_difference = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
#     # --- Increment (without promotion) ---
#     increment_proposed_basic = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
#     increment_proposed_gross = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
#     increment_gross_difference = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
#     # --- Pay Progression (PP) Only ---
#     pp_proposed_basic = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
#     pp_proposed_gross = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
#     pp_gross_difference = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
#     def calculate_variance(self):

#         FACTOR = 0.55 
        
#         # Current salary
#         if self.current_basic is not None:
#             self.current_gross = self.current_basic / FACTOR
        
#         # Promotion with Increment
#         if self.promo_with_increment_proposed_basic is not None:
#             self.promo_with_increment_proposed_gross = self.promo_with_increment_proposed_basic / FACTOR
#             self.promo_with_increment_gross_difference = self.promo_with_increment_proposed_gross - self.current_gross
        
#         # Promotion without Increment
#         if self.promo_without_increment_proposed_basic is not None:
#             self.promo_without_increment_proposed_gross = self.promo_without_increment_proposed_basic / FACTOR
#             self.promo_without_increment_gross_difference = self.promo_without_increment_proposed_gross - self.current_gross
            
#         # Increment (without promotion)
#         if self.increment_proposed_basic is not None:
#             self.increment_proposed_gross = self.increment_proposed_basic / FACTOR
#             self.increment_gross_difference = self.increment_proposed_gross - self.current_gross

#         # Pay Progression (PP) Only
#         if self.pp_proposed_basic is not None:
           
#             self.pp_proposed_gross = self.pp_proposed_basic / FACTOR
#             self.pp_gross_difference = self.pp_proposed_gross - self.current_gross

#     def save(self, *args, **kwargs):
#         self.calculate_variance() 
#         super().save(*args, **kwargs)

#     def __str__(self):
#         return f"Salary Recommendation for {self.employee.name}"


# # --- Shared Decision Logic ---

# DECISION_SUFFIXES = [
#     ('Promotion with Increment', 'promo_w_increment_yes', 'promo_w_increment_no'),
#     ('Promotion with PP only', 'promo_w_pp_only_yes', 'promo_w_pp_only_no'), 
#     ('Increment without Promotion', 'increment_w_no_promo_yes', 'increment_w_no_promo_no'),
#     ('Only Pay Progression (PP)', 'pp_only_yes', 'pp_only_no'),
#     ('Promotion/Increment/PP Deferred', 'deferred_yes', 'deferred_no'),
# ]

# def _validate_review_decisions(instance, prefix):

#     errors = {}
    
#     for name, yes_suffix, no_suffix in DECISION_SUFFIXES:
#         yes_attr = f'{prefix}_{yes_suffix}'
#         no_attr = f'{prefix}_{no_suffix}'

#         try:
#             yes = getattr(instance, yes_attr)
#             no = getattr(instance, no_attr)
            
#             if yes == no:
#                 error_message = f"A decision must be explicitly made ('Yes' or 'No') for '{name}'. It cannot be unanswered or ambiguous."
#                 errors[yes_attr] = error_message
#                 errors[no_attr] = error_message
                
#         except AttributeError:
            
#             print(f"Validation Error: Decision pair attributes {yes_attr} or {no_attr} not found on instance.")


#     if errors:
#         raise ValidationError(errors)