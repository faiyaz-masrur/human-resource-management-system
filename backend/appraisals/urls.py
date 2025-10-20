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
    FullAppraisalAPIView,
    AppraisalDetailsAPIView
)

urlpatterns = [
    # Employee self-appraisal
    path('submit-self-appraisal/', EmployeeSelfAppraisalAPIView.as_view(), name='employee-self-appraisal'),

    # Review submission endpoints
    path('submit-rm-review/<int:appraisal_id>/', ReportingManagerReviewAPIView.as_view(), name='submit-rm-review'),
    path('submit-hr-review/<int:appraisal_id>/', HRReviewAPIView.as_view(), name='submit-hr-review'),
    path('submit-hod-review/<int:appraisal_id>/', HODReviewAPIView.as_view(), name='submit-hod-review'),
    path('submit-coo-review/<int:appraisal_id>/', COOReviewAPIView.as_view(), name='submit-coo-review'),
    path('submit-ceo-review/<int:appraisal_id>/', CEOReviewAPIView.as_view(), name='submit-ceo-review'),

    # Review lists
    path('rm-review-list/', ReviewAppraisalListAPIView.as_view(), name='rm-review-list'),
    path('status-list/', AllAppraisalStatusAPIView.as_view(), name='all-appraisal-status-list'),
    path('all-appraisals/', AllAppraisalListAPIView.as_view(), name='all-appraisal-list'),

    # Full appraisal detail view
    path('full-appraisal/<int:appraisal_id>/', FullAppraisalAPIView.as_view(), name='full-appraisal'),

    # Appraisal details (HR editable fields)
    path('details/<int:employee_id>/', AppraisalDetailsAPIView.as_view(), name='appraisal-details'),
]
