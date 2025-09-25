from django import forms
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from .models import Employee
import secrets, string

def generate_password(length=10):
    alphabet = string.ascii_letters + string.digits + string.punctuation
    return ''.join(secrets.choice(alphabet) for i in range(length))

class EmployeeCreationForm(forms.ModelForm):
    password = ReadOnlyPasswordHashField(
        label="Password",
        help_text="Password will be auto-generated and sent via email."
    )

    class Meta:
        model = Employee
        fields = (
            'email',
            'employee_id',
            'employee_name',
            'department',
            'designation',
            'grade',
            'basic_salary',
            'joining_date',
            'is_rm', 'is_hr', 'is_hod', 'is_coo', 'is_ceo', 'is_staff', 'is_superuser', 'is_active',
            'reviewed_by_rm', 'reviewed_by_hr', 'reviewed_by_hod', 'reviewed_by_coo', 'reviewed_by_ceo',
            'reporting_manager'
        )

    def save(self, commit=True):
        employee = super().save(commit=False)
        if not employee.pk:  
            raw_password = generate_password()
            employee.set_password(raw_password)
            employee._raw_password = raw_password
        if commit:
            employee.save()
        return employee
