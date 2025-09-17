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
    
    # Timer Creation Paths
    path('admin/employee-timer/create/', views.EmployeeAppraisalTimerCreationAPIView.as_view(), name='api_create_employee_timer'),
    path('admin/manager-timer/create/', views.ReportingManagerAppraisalTimerCreationAPIView.as_view(), name='api_create_manager_timer'),
    path('admin/final-timer/create/', views.FinalReviewerAppraisalTimerCreationAPIView.as_view(), name='api_create_final_timer'),
    
    # Appraisal History Path
    path('history/<int:appraisal_id>/', views.AppraisalHistoryAPIView.as_view(), name='api_appraisal_history'),
]
