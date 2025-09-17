from django.urls import path
from .views import EmployeeProfileView

urlpatterns = [
    # URL for an employee to view and edit their own profile
    path('profile/', EmployeeProfileView.as_view(), name='employee_profile'),
]
