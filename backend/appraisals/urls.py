'''
from django.urls import path
from .views import (
    # --- Review (For RM, HR, HOD, COO, CEO reviewing employees) ---
    ReviewAppraisalListAPIView,
    ReviewAppraisalDetailAPIView,
    ReviewEmployeeAppraisalBaseAPIView,
    RMReviewAPIView,  
    HRReviewAPIView,
    HODReviewAPIView,
    COOReviewAPIView,
    CEOReviewAPIView,

    # --- All Appraisals (For Admin / HR global view) ---
    AllAppraisalListAPIView,
    AllAppraisalDetailAPIView,
    AllAppraisalEmployeeBaseAPIView,
    AllAppraisalRMDetailAPIView,
    AllAppraisalHRDetailAPIView,
    AllAppraisalHODDetailAPIView,
    AllAppraisalCOODetailAPIView,
    AllAppraisalCEODetailAPIView,

    # --- Status / Employee endpoints ---
    AppraisalStatusAPIView,
    AppraisalDetailAPIView,
    EmployeeSelfAppraisalAPIView,
    EmployeeViewRMReviewAPIView,
    EmployeeViewHRReviewAPIView,
    EmployeeViewCOOReviewAPIView,
    EmployeeViewCEOReviewAPIView,
)

urlpatterns = [
    # --------------------------------------------------------------------------
    # 1. Review Appraisals (For Reviewers - RM, HR, HOD, COO, CEO)
    # --------------------------------------------------------------------------
    path('review-appraisal/', ReviewAppraisalListAPIView.as_view(), name='review-appraisals'),
    path('review-appraisal/appraisal-details/<int:employee_id>/', ReviewAppraisalDetailAPIView.as_view(), name='review-appraisal-details'),
    path('review-appraisal/employee-appraisal/<int:employee_id>/', ReviewEmployeeAppraisalBaseAPIView.as_view(), name='review-employee-appraisal-base'),
    path('review-appraisal/employee-appraisal/<int:employee_id>/rm/', RMReviewAPIView.as_view(), name='review-employee-appraisal-rm'),
    path('review-appraisal/employee-appraisal/<int:employee_id>/hr/', HRReviewAPIView.as_view(), name='review-employee-appraisal-hr'),
    path('review-appraisal/employee-appraisal/<int:employee_id>/hod/', HODReviewAPIView.as_view(), name='review-employee-appraisal-hod'),
    path('review-appraisal/employee-appraisal/<int:employee_id>/coo/', COOReviewAPIView.as_view(), name='review-employee-appraisal-coo'),
    path('review-appraisal/employee-appraisal/<int:employee_id>/ceo/', CEOReviewAPIView.as_view(), name='review-employee-appraisal-ceo'),

    # --------------------------------------------------------------------------
    # 2. All Appraisals (For Administrative / HR overview)
    # --------------------------------------------------------------------------
    path('all-appraisal/', AllAppraisalListAPIView.as_view(), name='all-appraisal-list'),
    path('all-appraisal/appraisal-details/<int:employee_id>/', AllAppraisalDetailAPIView.as_view(), name='all-appraisal-details'),
    path('all-appraisal/employee-appraisal/<int:employee_id>/', AllAppraisalEmployeeBaseAPIView.as_view(), name='all-appraisal-employee-base'),
    path('all-appraisal/employee-appraisal/<int:employee_id>/rm/', AllAppraisalRMDetailAPIView.as_view(), name='all-appraisal-rm-detail'),
    path('all-appraisal/employee-appraisal/<int:employee_id>/hr/', AllAppraisalHRDetailAPIView.as_view(), name='all-appraisal-hr-detail'),
    path('all-appraisal/employee-appraisal/<int:employee_id>/hod/', AllAppraisalHODDetailAPIView.as_view(), name='all-appraisal-hod-detail'),
    path('all-appraisal/employee-appraisal/<int:employee_id>/coo/', AllAppraisalCOODetailAPIView.as_view(), name='all-appraisal-coo-detail'),
    path('all-appraisal/employee-appraisal/<int:employee_id>/ceo/', AllAppraisalCEODetailAPIView.as_view(), name='all-appraisal-ceo-detail'),

    # --------------------------------------------------------------------------
    # 3. Status & Employee Self Appraisals
    # --------------------------------------------------------------------------
    path('appraisal-status/', AppraisalStatusAPIView.as_view(), name='appraisal-status-list'),
    path('appraisal-details/<int:employee_id>/', AppraisalDetailAPIView.as_view(), name='appraisal-details'),
    path('my-appraisal/<int:employee_id>/', EmployeeSelfAppraisalAPIView.as_view(), name='my-appraisal-base'),

    # --------------------------------------------------------------------------
    # 4. Employee Views (readonly feedback views)
    # --------------------------------------------------------------------------
    path('my-appraisal/<int:employee_id>/rm/', EmployeeViewRMReviewAPIView.as_view(), name='my-appraisal-rm-review'),
    path('my-appraisal/<int:employee_id>/hr/', EmployeeViewHRReviewAPIView.as_view(), name='my-appraisal-hr-review'),
    path('my-appraisal/<int:employee_id>/coo/', EmployeeViewCOOReviewAPIView.as_view(), name='my-appraisal-coo-review'),
    path('my-appraisal/<int:employee_id>/ceo/', EmployeeViewCEOReviewAPIView.as_view(), name='my-appraisal-ceo-review'),
]
'''

from django.urls import path
from .views import (
    # --- Reviewer Action Views (Used for endpoints 6 & 7) ---
    RMReviewAPIView,
    HRReviewAPIView,
    HODReviewAPIView,
    COOReviewAPIView,
    CEOReviewAPIView,

    # --- List/Status Views (Used for endpoints 2, 3, 4) ---
    ReviewAppraisalListAPIView, # 3. All review appraisals (reviewer view)
    AllAppraisalListAPIView,    # 2. All appraisals (admin/HR)
    AppraisalStatusAPIView,     # 4. Appraisal status table

    # --- Employee/Base Views (Used for endpoints 1 & 5) ---
    AppraisalDetailAPIView,     # 1. Single appraisal details (employee view)
    EmployeeSelfAppraisalAPIView, # 5. Base employee appraisal (self-appraisal)

    # Note: Other imported views from the original file are kept for context,
    # but their specific paths have been removed to match the frontend API consolidation.
    ReviewAppraisalDetailAPIView,
    ReviewEmployeeAppraisalBaseAPIView,
    AllAppraisalDetailAPIView,
    AllAppraisalEmployeeBaseAPIView,
    AllAppraisalRMDetailAPIView,
    AllAppraisalHRDetailAPIView,
    AllAppraisalHODDetailAPIView,
    AllAppraisalCOODetailAPIView,
    AllAppraisalCEODetailAPIView,
    EmployeeViewRMReviewAPIView,
    EmployeeViewHRReviewAPIView,
    EmployeeViewCOOReviewAPIView,
    EmployeeViewCEOReviewAPIView,
)

urlpatterns = [
    # --------------------------------------------------------------------------
    # 1. List and Status Endpoints (Matching Frontend APIs 2, 3, 4)
    # --------------------------------------------------------------------------
    # /api/appraisals/all-appraisal/ (2. Admin/HR All Appraisals)
    path('all-appraisal/', AllAppraisalListAPIView.as_view(), name='all-appraisal-list'),

    # /api/appraisals/review-appraisal/ (3. Reviewer List)
    path('review-appraisal/', ReviewAppraisalListAPIView.as_view(), name='review-appraisal-list'),

    # /api/appraisals/appraisal-status/ (4. Status Table)
    path('appraisal-status/', AppraisalStatusAPIView.as_view(), name='appraisal-status-list'),

    # --------------------------------------------------------------------------
    # 2. Employee Specific Appraisals (Matching Frontend APIs 1, 5, 6)
    # --------------------------------------------------------------------------
    # /api/appraisals/appraisal-details/<employee_id>/ (1. Employee Read-Only Detail View)
    path('appraisal-details/<int:employee_id>/', AppraisalDetailAPIView.as_view(), name='appraisal-details-view'),

    # /api/appraisals/employee-appraisal/<employeeId>/ (5. Employee Self-Appraisal Base)
    # This is for the employee to view/submit their own base appraisal data.
    path('employee-appraisal/<int:employee_id>/', EmployeeSelfAppraisalAPIView.as_view(), name='employee-self-appraisal-base'),

    # /api/appraisals/employee-appraisal/<employeeId>/[reviewer]/ (6. Reviewer Detail/Action View)
    # This structure is used for RM, HR, HOD, COO, and CEO to access the detailed review page
    # for a specific employee. I map to the action views (e.g., RMReviewAPIView).
    path('employee-appraisal/<int:employee_id>/rm/', RMReviewAPIView.as_view(), name='employee-appraisal-rm-detail'),
    path('employee-appraisal/<int:employee_id>/hr/', HRReviewAPIView.as_view(), name='employee-appraisal-hr-detail'),
    path('employee-appraisal/<int:employee_id>/hod/', HODReviewAPIView.as_view(), name='employee-appraisal-hod-detail'),
    path('employee-appraisal/<int:employee_id>/coo/', COOReviewAPIView.as_view(), name='employee-appraisal-coo-detail'),
    path('employee-appraisal/<int:employee_id>/ceo/', CEOReviewAPIView.as_view(), name='employee-appraisal-ceo-detail'),
]
