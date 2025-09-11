from django.urls import path
from . import views

urlpatterns = [
    # URLs for the web application (using class-based views)
    path('self-appraisal/', views.EmployeeSelfAppraisalView.as_view(), name='employee_self_appraisal'),
    path('manager-review/<int:appraisal_id>/', views.ReportingManagerReviewView.as_view(), name='reporting_manager_review'),
    path('hr-review/<int:appraisal_id>/', views.HRReviewView.as_view(), name='hr_review'),
    path('final-review/<int:appraisal_id>/', views.FinalReviewView.as_view(), name='final_review'),
]
