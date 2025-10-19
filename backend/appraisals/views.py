from django.shortcuts import get_object_or_404
from django.db import transaction
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.permissions import BasePermission

from system.models import RolePermission 

from .models import (
    EmployeeAppraisal,
    ReportingManagerReview,
    HrReview, 
    HodReview, 
    CooReview, 
    CeoReview, 
    EmployeeAppraisalTimer, 
    EmployeeAppraisalStatusTrack 
)
from .serializers import (
    EmployeeAppraisalSerializer,
    ReportingManagerReviewSerializer,
    HRReviewSerializer,
    HODReviewSerializer,
    COOReviewSerializer, 
    CEOReviewSerializer, 
    AppraisalDetailsSerializer, 
)

# ------------------- 1. Permission Class -------------------

class HasAppraisalPermission(BasePermission):
    """
    Custom permission to check user's role against specific workspace, sub-workspace,
    and permission type (view, create, edit) defined on the API view.
    """

    def has_permission(self, request, view):
        user = request.user
        # Basic authentication and role check
        if not user.is_authenticated or not hasattr(user, 'role') or not user.role:
            return False

        # Get required permissions from the view attributes
        workspace = getattr(view, 'permission_workspace', None)
        sub_workspace = getattr(view, 'permission_sub_workspace', None)
        permission_type = getattr(view, 'permission_type', None)

        if not workspace or not sub_workspace or not permission_type:
            # If the view fails to define required attributes, deny access defensively
            return False

        try:
            # Look up the specific permission for the user's role
            permission = RolePermission.objects.get(
                role=user.role,
                workspace=workspace,
                sub_workspace=sub_workspace
            )
            # Dynamically check if the required type (e.g., 'edit') is True
            return getattr(permission, permission_type, False)
        except RolePermission.DoesNotExist:
            return False
        except Exception:
            # Catch unexpected database or attribute errors
            return False

# ------------------- 2. Reusable Mixins and Base Classes -------------------

class AppraisalPermissionMixin:
    """Mixin for applying the custom permission class and defining required attributes."""

    permission_classes = [HasAppraisalPermission]
    permission_workspace = None
    permission_sub_workspace = None
    permission_type = None

class AppraisalReviewSubmissionMixin:
    """
    Mixin to handle the common logic for submitting or updating any review 
    (RM, HR, HOD, COO, CEO).
    """
    review_model = None         # e.g., ReportingManagerReview
    review_serializer = None    # e.g., ReportingManagerReviewSerializer
    status_track_field = None   # e.g., 'rm_review_done'
    # Use EmployeeAppraisalTimer as the default/only timer model
    required_timer_model = EmployeeAppraisalTimer 

    def check_appraisal_timer(self):
        """Checks if the required timer period is active."""
        # HR Review is configured to bypass this check via required_timer_model = None
        if self.required_timer_model:
            # Fetches the single global timer instance (assumed to be pk=1 or first() if not pk=1)
            timer = self.required_timer_model.objects.first()
            if not timer or not timer.is_active_period():
                return False, 'The review period is not currently active.'
        return True, None

    def check_review_authorization(self, request, appraisal):
        """Default authorization check. Override for specific cases (like RM)."""
        return True, None

    def post(self, request, appraisal_id):
        # 1. Check timer
        if self.required_timer_model is not None:
             timer_ok, error_msg = self.check_appraisal_timer()
             if not timer_ok:
                 return Response({'error': error_msg}, status=status.HTTP_400_BAD_REQUEST)

        try:
            appraisal = get_object_or_404(EmployeeAppraisal, pk=appraisal_id)

            # 2. Check custom authorization (e.g., must be the employee's RM)
            auth_ok, auth_error = self.check_review_authorization(request, appraisal)
            if not auth_ok:
                return Response({'error': auth_error}, status=status.HTTP_403_FORBIDDEN)

            # 3. Get or create the specific review instance
            # This handles both initial submission ('create') and subsequent updates ('edit')
            # NOTE: We assume the reviewer field on the review model is the FK to the User's EmployeeProfile.
            review_instance, _ = self.review_model.objects.get_or_create(
                appraisal=appraisal,
                reviewer=request.user.employee_profile 
            )

            # 4. Serialize and Validate
            serializer = self.review_serializer(instance=review_instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)

            with transaction.atomic():
                # 5. Save the Review
                serializer.save()

                # 6. Update Status Track
                if self.status_track_field:
                    track, _ = EmployeeAppraisalStatusTrack.objects.get_or_create(employee=appraisal.employee)
                    # Use setattr to dynamically set the correct status field (e.g., 'rm_review_done')
                    setattr(track, self.status_track_field, True)
                    track.save()

                return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            # Log the error (not shown here, but good practice)
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class BaseAppraisalReviewAPIView(AppraisalPermissionMixin, AppraisalReviewSubmissionMixin, APIView):
    """
    Base view for all review submissions (RM, HR, HOD, COO, CEO).
    Requires 'edit' permission for submissions (covers both create/update).
    """
    permission_workspace = 'ReviewAppraisal'
    permission_type = 'edit'
    

# ------------------- 3. Specific Review API Views -------------------

class EmployeeSelfAppraisalAPIView(AppraisalPermissionMixin, APIView):
    """Employee submitting their self-appraisal."""

    permission_workspace = 'MyAppraisal'
    permission_sub_workspace = 'MyEmployeeAppraisal'
    permission_type = 'create' 
    
    def post(self, request):
        appraisal_timer = EmployeeAppraisalTimer.objects.first()
        if not appraisal_timer or not appraisal_timer.is_active_period():
            return Response(
                {'error': 'The employee self-appraisal period is not currently active.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = EmployeeAppraisalSerializer(data=request.data)
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    # The user's employee profile must be linked to the appraisal
                    appraisal_instance = serializer.save(
                        employee=request.user.employee_profile
                    )
                    
                    # Update EmployeeAppraisalStatusTrack
                    track, _ = EmployeeAppraisalStatusTrack.objects.get_or_create(
                        employee=appraisal_instance.employee
                    )
                    track.self_appraisal_done = True
                    track.save()
                    
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
            except AttributeError:
                # Handle case where request.user.employee_profile might not exist
                 return Response(
                    {'error': 'User profile not found. Cannot submit appraisal.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# --- Reporting Manager Review ---

class ReportingManagerReviewAPIView(BaseAppraisalReviewAPIView):
    """RM submitting or updating their review."""
    review_model = ReportingManagerReview
    review_serializer = ReportingManagerReviewSerializer
    status_track_field = 'rm_review_done'
    # Uses EmployeeAppraisalTimer from the Mixin
    permission_sub_workspace = 'EmployeeRmReview'

    def check_review_authorization(self, request, appraisal):
        """Custom check: only the designated RM can submit and only after self-appraisal."""
        if not hasattr(request.user, 'employee_profile') or appraisal.employee.reporting_manager != request.user.employee_profile:
            return False, 'You are not the designated Reporting Manager for this appraisal.'
        
        # Ensure the employee's self-appraisal is done before RM review
        try:
            if not appraisal.employee.employeeappraisalstatustrack.self_appraisal_done:
                return False, 'The employee has not completed the self-appraisal yet.'
        except EmployeeAppraisalStatusTrack.DoesNotExist:
            # If track doesn't exist, self-appraisal definitely isn't done
            return False, 'The employee has not completed the self-appraisal yet.'
            
        return True, None

# --- HR Review (No Timer Check) ---

class HRReviewAPIView(BaseAppraisalReviewAPIView):
    """HR submitting or updating their review (Always allowed to edit/create)."""
    review_model = HrReview
    review_serializer = HRReviewSerializer
    status_track_field = 'hr_review_done'
    required_timer_model = None  # HR review bypasses the general timer check
    permission_sub_workspace = 'EmployeeHrReview'


class HODReviewAPIView(BaseAppraisalReviewAPIView):
    """HOD submitting or updating their review."""
    review_model = HodReview
    review_serializer = HODReviewSerializer
    status_track_field = 'hod_review_done'
    # Uses EmployeeAppraisalTimer from the Mixin
    permission_sub_workspace = 'EmployeeHodReview' 

class COOReviewAPIView(BaseAppraisalReviewAPIView):
    """COO submitting or updating their review."""
    review_model = CooReview
    review_serializer = COOReviewSerializer
    status_track_field = 'coo_review_done'
    # Uses EmployeeAppraisalTimer from the Mixin
    permission_sub_workspace = 'EmployeeCooReview' 

class CEOReviewAPIView(BaseAppraisalReviewAPIView):
    """CEO submitting or updating their review."""
    review_model = CeoReview
    review_serializer = CEOReviewSerializer
    status_track_field = 'ceo_review_done'
    # Uses EmployeeAppraisalTimer from the Mixin
    permission_sub_workspace = 'EmployeeCeoReview' 

# ------------------- 4. List Views (Kept for distinct permission types) -------------------

class ReviewAppraisalListAPIView(AppraisalPermissionMixin, ListAPIView):
    """
    RM viewing the list of appraisals they need to review. 
    This list is *always* available (not timer constrained) for RMs with 'edit' permission.
    """
    permission_workspace = 'ReviewAppraisal'
    permission_sub_workspace = 'ReviewAppraisalList' 
    permission_type = 'edit' 
    serializer_class = EmployeeAppraisalSerializer

    def get_queryset(self):
        try:
            manager_profile = self.request.user.employee_profile
            # Only list appraisals for employees reporting to this manager
            # and who have completed self-appraisal but not RM review.
            return EmployeeAppraisal.objects.filter(
                employee__reporting_manager=manager_profile,
                employee__employeeappraisalstatustrack__self_appraisal_done=True,
                employee__employeeappraisalstatustrack__rm_review_done=False,
            )
        except AttributeError:
            # Handle case where user might not have an employee_profile (e.g., admin)
            return EmployeeAppraisal.objects.none()

class AllAppraisalStatusAPIView(AppraisalPermissionMixin, ListAPIView):
    """
    Lists all initiated employee appraisals for general status viewing (VIEW permission).
    """
    permission_workspace = 'AllAppraisal'
    permission_sub_workspace = 'AppraisalStatus' 
    permission_type = 'view' 
    
    serializer_class = AppraisalDetailsSerializer 

    def get_queryset(self):
        # Fetch all EmployeeAppraisal records that have been submitted (are "active")
        # Pre-fetching related data for performance.
        queryset = EmployeeAppraisal.objects.select_related(
            'employee',
            'employee__employeeappraisalstatustrack',
            'reportingmanagerreview', 
            'hrreview', 
            'hodreview', 
            'cooreview', 
            'ceoreview' 
        ).filter(
            # Only include appraisals where the employee has completed their self-appraisal
            employee__employeeappraisalstatustrack__self_appraisal_done=True
        )
        return queryset


class AllAppraisalListAPIView(AppraisalPermissionMixin, ListAPIView):
    """
    Lists all initiated employee appraisals for viewing and **editing/actioning** (EDIT permission).
    Kept separate from Status view to distinguish roles that can take action vs. only view status.
    """
    permission_workspace = 'AllAppraisal'
    permission_sub_workspace = 'AllAppraisalList' 
    permission_type = 'edit' # Grants ability to see list and click action buttons
    
    serializer_class = AppraisalDetailsSerializer 

    def get_queryset(self):
        # Fetch all EmployeeAppraisal records that have been submitted (are "active")
        queryset = EmployeeAppraisal.objects.select_related(
            'employee',
            'employee__employeeappraisalstatustrack',
            'reportingmanagerreview', 
            'hrreview', 
            'hodreview', 
            'cooreview', 
            'ceoreview' 
        ).filter(
            # Only include appraisals where the employee has completed their self-appraisal
            employee__employeeappraisalstatustrack__self_appraisal_done=True
        )
        return queryset


# ------------------- 5. Appraisal History API View (Consolidated Detail View) -------------------
# The former AppraisalDetailAPIView has been removed as this view is sufficient and safer.

class AppraisalDetailsAPIView(APIView):
    """
    Retrieves appraisal history selectively based on the user's granular view permissions.
    This view serves as the ONLY detail view.
    """
    
    def get(self, request, appraisal_id):
        user = request.user
        if not user.is_authenticated or not hasattr(user, 'role') or not user.role:
            return Response({'detail': 'Authentication credentials were not provided.'}, status=status.HTTP_401_UNAUTHORIZED)
        
        # Prefetch related data to optimize database queries
        appraisal = get_object_or_404(
            EmployeeAppraisal.objects.select_related(
                'reportingmanagerreview', 
                'hrreview', 
                'hodreview', 
                'cooreview', 
                'ceoreview' 
            ), 
            pk=appraisal_id
        )

        is_appraised_employee = (hasattr(user, 'employee_profile') and appraisal.employee == user.employee_profile)
        # Assumes 'HR' role can be identified by name (adjust if role checking is more complex)
        is_hr = user.role.name.upper() == 'HR' 

        response_data = {}
        
        # --- Define Workspaces and Phase Mappings ---
        if is_appraised_employee:
            # Employee viewing their own appraisal
            base_workspace = 'MyAppraisal'
            phase_map = {
                'Employee Appraisal': 'My Employee Appraisal',
                'Reporting Manager Review': 'My Reporting Manager Review',
                'HR Review': 'My HR Review',
                'HOD Review': 'My HOD Review',
                'COO Review': 'My COO Review',
                'CEO Review': 'My CEO Review',
            }
        else:
            # Reviewer/Other viewing someone else's appraisal
            base_workspace = 'ReviewAppraisal'
            phase_map = {
                'Employee Appraisal': 'Employee Appraisal',
                'Reporting Manager Review': 'Reporting Manager Review', 
                'HR Review': 'HR Review', 
                'HOD Review': 'HOD Review', 
                'COO Review': 'COO Review', 
                'CEO Review': 'CEO Review', 
            }

        # --- Core Authorization Check for Non-Employee/Non-HR ---
        # If not the employee and not HR, check if they have at least general view access 
        # to prevent unauthorized browsing of the main list.
        if not is_appraised_employee and not is_hr:
            try:
                # Check base 'ReviewAppraisalList' view permission
                RolePermission.objects.get(
                    role=user.role, 
                    workspace=base_workspace, 
                    sub_workspace='ReviewAppraisalList',
                    view=True
                )
            except RolePermission.DoesNotExist:
                # If no base permission is found, block access
                return Response({'detail': 'You do not have general permission to view this type of appraisal record.'}, status=status.HTTP_403_FORBIDDEN)


        def user_can_view_phase(generic_phase_name):
            """
            Helper to check granular view permission based on the determined workspace.
            
            Based on requirements:
            - Employee and HR always see all phases.
            - RM/HOD/COO/CEO must have explicit 'view' permission in RolePermission table.
            """
            # Employee and HR always see all phases
            if is_appraised_employee or is_hr:
                return True
            
            # Non-employee/Non-HR: Check granular 'view' permission
            try:
                sub_workspace = phase_map.get(generic_phase_name)
                if not sub_workspace:
                    return False
                    
                permission = RolePermission.objects.get(
                    role=user.role,
                    workspace=base_workspace, 
                    sub_workspace=sub_workspace
                )
                return permission.view
            except RolePermission.DoesNotExist:
                return False

        # --- Data Retrieval and Serialization ---
        
        # Employee's own appraisal details are always shown (if it exists)
        response_data['employee_appraisal'] = EmployeeAppraisalSerializer(appraisal).data
        
        # 1. Try to fetch RM Review
        if user_can_view_phase('Reporting Manager Review'):
            if hasattr(appraisal, 'reportingmanagerreview'):
                response_data['reporting_manager_review'] = ReportingManagerReviewSerializer(appraisal.reportingmanagerreview).data
            else:
                 response_data['reporting_manager_review'] = None
            
        # 2. Try to fetch HR Review
        if user_can_view_phase('HR Review'):
            if hasattr(appraisal, 'hrreview'):
                response_data['hr_review'] = HRReviewSerializer(appraisal.hrreview).data
            else:
                response_data['hr_review'] = None
            
        # 3. Try to fetch Granular Final Reviews
        
        if user_can_view_phase('HOD Review'):
            if hasattr(appraisal, 'hodreview'):
                response_data['hod_review'] = HODReviewSerializer(appraisal.hodreview).data
            else:
                response_data['hod_review'] = None

        if user_can_view_phase('COO Review'):
            if hasattr(appraisal, 'cooreview'):
                response_data['coo_review'] = COOReviewSerializer(appraisal.cooreview).data
            else:
                response_data['coo_review'] = None
                
        if user_can_view_phase('CEO Review'):
            if hasattr(appraisal, 'ceoreview'):
                response_data['ceo_review'] = CEOReviewSerializer(appraisal.ceoreview).data
            else:
                response_data['ceo_review'] = None
                
        return Response(response_data, status=status.HTTP_200_OK)
