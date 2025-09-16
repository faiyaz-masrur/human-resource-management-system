from django.urls import path
from .views import EmployeeRetrieveUpdateView

urlpatterns = [
    # URL for an employee to view and edit their own profile
    path('profile/', EmployeeRetrieveUpdateView.as_view(), name='employee_profile'),
]
