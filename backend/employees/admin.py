from django.contrib import admin
from .models import Employee, WorkExperience, Education, ProfessionalCertificate

# Inline classes to allow editing related models within the Employee admin page

class WorkExperienceInline(admin.StackedInline):
    model = WorkExperience
    extra = 0

class EducationInline(admin.StackedInline):
    model = Education
    extra = 0

class ProfessionalCertificateInline(admin.StackedInline):
    model = ProfessionalCertificate
    extra = 0

# Main admin class for the Employee model

@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    # ... (existing EmployeeAdmin configuration) ...
    list_display = ('email', 'employee_id', 'employee_name', 'designation', 'department', 'reporting_manager')
    list_filter = ('department', 'grade', 'reviewed_by_rm', 'reviewed_by_hr', 'reviewed_by_hod')
    search_fields = ('employee_name', 'designation', 'department')
    fieldsets = (
        ('System Information', {
            'fields': ('email', 'password')
        }),
        ('Employee Information', {
            'fields': ('employee_id', 'employee_name')
        }),
        ('Dependent and Designation', {
            'fields': ('department', 'designation')
        }),
        ('Grade and Financial Information', {
            'fields': ('grade', 'basic_salary')
        }),
        ('Important Dates', {
            'fields': ('joining_date',)
        }),
        ('Permissions', {
            'fields': ('is_rm', 'is_hr', 'is_hod', 'is_coo', 'is_ceo', 'is_staff', 'is_superuser', 'is_active'),
        }),
        ('Review Status', {
            'fields': ('reviewed_by_rm', 'reviewed_by_hr', 'reviewed_by_hod', 'reviewed_by_coo', 'reviewed_by_ceo')
        }),
        ('Reporting to', {
            'fields': ('reporting_manager',)
        }),
        ('Responsibilities', {
            'fields': ('responsibilities',)
        }),
        ('Media', {
            'classes': ('collapse',),
            'fields': ('signature', 'image')
        }),
    )
    
    search_fields = ('email', 'employee_id')
    ordering = ('email',)
    inlines = [
        WorkExperienceInline,
        EducationInline,
        ProfessionalCertificateInline,
    ]

    def get_fieldsets(self, request, obj=None):
        """
        Hide 'Responsibilities and Media' fieldset on add page (obj is None)
        """
        if obj is None:
            return (
                ('System Information', {
                    'fields': ('email', 'password')
                }),
                ('Employee Information', {
                    'fields': ('employee_id', 'employee_name')
                }),
                ('Dependent and Designation', {
                    'fields': ('department', 'designation')
                }),
                ('Grade and Financial Information', {
                    'fields': ('grade', 'basic_salary')
                }),
                ('Important Dates', {
                    'fields': ('joining_date',)
                }),
                ('Permissions', {
                    'fields': ('is_rm', 'is_hr', 'is_hod', 'is_coo', 'is_ceo', 'is_staff', 'is_superuser', 'is_active'),
                }),
                ('Review Status', {
                    'fields': ('reviewed_by_rm', 'reviewed_by_hr', 'reviewed_by_hod', 'reviewed_by_coo', 'reviewed_by_ceo')
                }),
                ('Reporting to', {
                    'fields': ('reporting_manager',)
                }),
            )
        # Edit page: show all fieldsets
        return super().get_fieldsets(request, obj)

    def get_inline_instances(self, request, obj=None):
        """
        Only show inlines if obj exists (i.e., edit page).
        Hide in add page (obj is None).
        """
        if obj is None:
            return []
        return super().get_inline_instances(request, obj)

# Registering the models separately with fieldsets

@admin.register(WorkExperience)
class WorkExperienceAdmin(admin.ModelAdmin):
    list_display = ('employee', 'organization', 'designation', 'start_date', 'end_date')
    search_fields = ('employee__employee_name',)
    autocomplete_fields = ['employee']
    
    fieldsets = (
        ('Association', {
            'fields': ('employee',)
        }),
        ('Experience Details', {
            'fields': ('organization', 'designation', ('start_date', 'end_date'))
        }),
    )

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return True

@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    list_display = ('employee', 'degree', 'institution', 'year')
    search_fields = ('employee__employee_name',)
    autocomplete_fields = ['employee']

    fieldsets = (
        ('Association', {
            'fields': ('employee',)
        }),
        ('Education Details', {
            'fields': ('degree', 'institution', 'year', 'certificate_file')
        }),
    )

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return True

@admin.register(ProfessionalCertificate)
class ProfessionalCertificateAdmin(admin.ModelAdmin):
    list_display = ('employee', 'certificate_name', 'credential_id', 'institution', 'issue_date')
    search_fields = ('employee__employee_name',)
    autocomplete_fields = ['employee']

    fieldsets = (
        ('Association', {
            'fields': ('employee',)
        }),
        ('Certificate Details', {
            'fields': ('certificate_name', 'credential_id', 'institution', 'issue_date', 'certificate_file')
        }),
    )

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return True