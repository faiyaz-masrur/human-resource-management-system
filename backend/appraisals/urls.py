from django.urls import path
from .views import (
    EmployeeSelfAppraisalAPIView,
    ReportingManagerReviewAPIView,
    HRReviewAPIView,
    HODReviewAPIView,
    COOReviewAPIView,
    CEOReviewAPIView,
    ReviewAppraisalListAPIView,
    AllAppraisalStatusAPIView,
    AllAppraisalListAPIView,
    AppraisalDetailsAPIView, # Consolidated Detail/History View
)

urlpatterns = [
    # --- Employee Submissions ---
    # Endpoint for employees to submit their own appraisal (Phase 1)
    path('submit-self-appraisal/', EmployeeSelfAppraisalAPIView.as_view(), name='employee-self-appraisal'),
    
    # --- Review Submissions (Update/Create) ---
    # Endpoints for reviewers to submit their respective phases, linked to a specific appraisal ID
    path('submit-rm-review/<int:appraisal_id>/', ReportingManagerReviewAPIView.as_view(), name='submit-rm-review'),
    path('submit-hr-review/<int:appraisal_id>/', HRReviewAPIView.as_view(), name='submit-hr-review'),
    path('submit-hod-review/<int:appraisal_id>/', HODReviewAPIView.as_view(), name='submit-hod-review'),
    path('submit-coo-review/<int:appraisal_id>/', COOReviewAPIView.as_view(), name='submit-coo-review'),
    path('submit-ceo-review/<int:appraisal_id>/', CEOReviewAPIView.as_view(), name='submit-ceo-review'),

    # --- List Views ---
    # List of appraisals requiring RM's action
    path('rm-review-list/', ReviewAppraisalListAPIView.as_view(), name='rm-review-list'),
    
    # List of all appraisals for general status check (View permission)
    path('status-list/', AllAppraisalStatusAPIView.as_view(), name='all-appraisal-status-list'),
    
    # List of all appraisals for roles with 'edit'/'action' permission
    path('all-appraisals/', AllAppraisalListAPIView.as_view(), name='all-appraisal-list'),

    # --- Detail/History View (Consolidated) ---
    # Unified detail view to retrieve all 6 phases with granular permissions applied
    path('details/<int:appraisal_id>/', AppraisalDetailsAPIView.as_view(), name='appraisal-details'),
]
