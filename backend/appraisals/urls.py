from django.urls import path
from . import views

urlpatterns = [
    path('self-appraisal/', views.employee_self_appraisal, name='employee_self_appraisal'),
    path('manager-review/<int:appraisal_id>/', views.reporting_manager_review, name='reporting_manager_review'),
    path('hr-review/<int:appraisal_id>/', views.hr_review, name='hr_review'),
    path('final-review/<int:appraisal_id>/', views.final_review, name='final_review'),
]
