from django.urls import path
from . import views

urlpatterns = [
    # These paths do not need the 'api/' prefix because it is already handled
    # by the root urls.py file.
    path('self-appraisal/', views.EmployeeSelfAppraisalAPIView.as_view(), name='api_employee_self_appraisal'),
    path('manager-review-list/', views.ManagerAppraisalListAPIView.as_view(), name='manager-appraisal-list'),
    path('manager-review/<int:appraisal_id>/', views.ReportingManagerReviewAPIView.as_view(), name='api_manager_review'),
    path('hr-review/<int:appraisal_id>/', views.HRReviewAPIView.as_view(), name='api_hr_review'),
    path('final-review/<int:appraisal_id>/', views.FinalReviewAPIView.as_view(), name='api_final_review'),
]
