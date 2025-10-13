from django.shortcuts import get_object_or_404
from django.db import transaction
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.permissions import BasePermission
from rest_framework.mixins import UpdateModelMixin 
from rest_framework.generics import GenericAPIView 

from system.models import RolePermission 

from .models import (
    EmployeeAppraisal,
    ReportingManagerReview,
    HRReview,
    FinalReview,
    EmployeeAppraisalTimer,
    ReportingManagerAppraisalTimer,
    FinalReviewerAppraisalTimer,
    EmployeeAppraisalTrack
)
from .serializers import (
    EmployeeAppraisalSerializer,
    ReportingManagerReviewSerializer,
    HRReviewSerializer,
    FinalReviewSerializer,
    EmployeeAppraisalTimerSerializer,
    ReportingManagerAppraisalTimerSerializer,
    FinalReviewerAppraisalTimerSerializer,
)

# ------------------- Custom Dynamic Permissions -------------------

class HasAppraisalPermission(BasePermission):
    """
    Custom permission that checks the RolePermission model for access 
    based on the provided WORKSPACE_CHOICES and SUB_WORKSPACE_CHOICES.
    
    The view must define:
    - view.permission_workspace (e.g., 'MyAppraisal')
    - view.permission_sub_workspace (e.g., 'MyEmployeeAppraisal')
    - view.permission_type ('view', 'create', 'edit', 'delete')
    """

    def has_permission(self, request, view):
        user = request.user
        # 1. Basic checks
        if not user.is_authenticated or not hasattr(user, 'role') or not user.role:
            return False

        # 2. Get the workspace, sub_workspace, and permission_type defined on the view
        workspace = getattr(view, 'permission_workspace', None)
        sub_workspace = getattr(view, 'permission_sub_workspace', None)
        permission_type = getattr(view, 'permission_type', None)

        if not workspace or not sub_workspace or not permission_type:
            # Fatal error: view is not correctly configured
            return False

        try:
            # 3. Query the RolePermission model
            permission = RolePermission.objects.get(
                role=user.role,
                workspace=workspace,
                sub_workspace=sub_workspace
            )
            
            # 4. Check if the specific permission type is True
            # For example, if permission_type is 'create', it checks permission.create
            return getattr(permission, permission_type, False)

        except RolePermission.DoesNotExist:
            return False
        except Exception:
             # Catches other potential DB/Attribute errors
            return False

# ------------------- API Views -------------------

class EmployeeSelfAppraisalAPIView(APIView):
    # Employee submitting their own appraisal (POST)
    permission_classes = [HasAppraisalPermission]
    permission_workspace = 'MyAppraisal'
    permission_sub_workspace = 'MyEmployeeAppraisal'
    permission_type = 'create' # Employee creating their self-appraisal
    
    def post(self, request):
        appraisal_timer = EmployeeAppraisalTimer.objects.first()
        if not appraisal_timer or not appraisal_timer.is_active_period():
            return Response(
                {'error': 'The employee self-appraisal period is not currently active.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = EmployeeAppraisalSerializer(data=request.data)
        if serializer.is_valid():
            with transaction.atomic():
                serializer.save(
                    employee=request.user.employee_profile
                )
                # --- Update EmployeeAppraisalTrack ---
                track, _ = EmployeeAppraisalTrack.objects.get_or_create(
                    employee=request.user.employee_profile
                )
                track.self_appraisal_done = True
                track.save()
                
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# --- RM List View ---

class ManagerAppraisalListAPIView(ListAPIView):
    # RM viewing the list of appraisals they need to review
    permission_classes = [HasAppraisalPermission]
    permission_workspace = 'ReviewAppraisal'
    permission_sub_workspace = 'ReviewAppraisalList'
    permission_type = 'view' 
    serializer_class = EmployeeAppraisalSerializer # Assuming this lists all appraisals needing RM review

    def get_queryset(self):
        try:
            timer = ReportingManagerAppraisalTimer.objects.first()
            if not timer or not timer.is_active_period():
                return EmployeeAppraisal.objects.none()

            manager_profile = self.request.user.employee_profile
            # Only list appraisals for employees reporting to this manager
            return EmployeeAppraisal.objects.filter(
                employee__reporting_manager=manager_profile,
                # Filter for those that have completed self-appraisal but not RM review
                employeeappraisaltrack__self_appraisal_done=True,
                employeeappraisaltrack__rm_review_done=False,
            )
        except AttributeError:
            return EmployeeAppraisal.objects.none()

# --- RM Review View ---

class ReportingManagerReviewAPIView(APIView):
    # RM submitting or updating their review
    permission_classes = [HasAppraisalPermission]
    permission_workspace = 'ReviewAppraisal'
    permission_sub_workspace = 'EmployeeRmReview'
    permission_type = 'edit' # Since it's a POST used for both create/update

    def post(self, request, appraisal_id):
        timer = ReportingManagerAppraisalTimer.objects.first()
        if not timer or not timer.is_active_period():
            return Response(
                {'error': 'The reporting manager review period is not currently active.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            appraisal = get_object_or_404(EmployeeAppraisal, pk=appraisal_id)
            
            # Additional Check: Ensure the user is the correct Reporting Manager
            if appraisal.employee.reporting_manager != request.user.employee_profile:
                 return Response(
                    {'error': 'You are not the designated Reporting Manager for this appraisal.'},
                    status=status.HTTP_403_FORBIDDEN
                )

            rm_review, created = ReportingManagerReview.objects.get_or_create(
                appraisal=appraisal,
                reviewer=request.user.employee_profile
            )
            serializer = ReportingManagerReviewSerializer(instance=rm_review, data=request.data, partial=True)

            if serializer.is_valid():
                with transaction.atomic():
                    serializer.save()

                    # --- Update EmployeeAppraisalTrack ---
                    track, _ = EmployeeAppraisalTrack.objects.get_or_create(employee=appraisal.employee)
                    track.rm_review_done = True
                    track.save()

                    return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# --- HR Review View ---

class HRReviewAPIView(APIView):
    # HR submitting or updating their review
    permission_classes = [HasAppraisalPermission]
    permission_workspace = 'ReviewAppraisal'
    permission_sub_workspace = 'EmployeeHrReview'
    permission_type = 'edit'

    def post(self, request, appraisal_id):
        # NOTE: Keeping your original timer logic, which uses FinalReviewerAppraisalTimer
        timer = FinalReviewerAppraisalTimer.objects.first() 
        if not timer or not timer.is_active_period():
            return Response(
                {'error': 'The HR review period is not currently active.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            appraisal = get_object_or_404(EmployeeAppraisal, pk=appraisal_id)
            hr_review, created = HRReview.objects.get_or_create(
                appraisal=appraisal,
                # NOTE: Assuming the HR user's profile is used as the reviewer
                reviewer=request.user.employee_profile
            )
            serializer = HRReviewSerializer(instance=hr_review, data=request.data, partial=True)

            if serializer.is_valid():
                with transaction.atomic():
                    serializer.save()

                    # --- Update EmployeeAppraisalTrack ---
                    track, _ = EmployeeAppraisalTrack.objects.get_or_create(employee=appraisal.employee)
                    track.hr_review_done = True
                    track.save()

                    return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# --- Final Review View (HOD/COO/CEO) ---

class FinalReviewAPIView(APIView):
    # Final Reviewers submitting or updating the final review
    permission_classes = [HasAppraisalPermission]
    permission_workspace = 'ReviewAppraisal'
    # We will use EmployeeHodReview as the common sub_workspace for all final reviewers.
    # The individual tracking (hod_review_done, coo_review_done) is handled internally.
    permission_sub_workspace = 'EmployeeHodReview' 
    permission_type = 'edit'

    def post(self, request, appraisal_id):
        timer = FinalReviewerAppraisalTimer.objects.first()
        if not timer or not timer.is_active_period():
            return Response(
                {'error': 'The final review period is not currently active.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            appraisal = get_object_or_404(EmployeeAppraisal, pk=appraisal_id)
            final_review_instance, created = FinalReview.objects.get_or_create(
                appraisal=appraisal,
                reviewer=request.user.employee_profile
            )
            serializer = FinalReviewSerializer(instance=final_review_instance, data=request.data, partial=True)

            if serializer.is_valid():
                with transaction.atomic():
                    serializer.save()

                    # --- Update EmployeeAppraisalTrack ---
                    track, _ = EmployeeAppraisalTrack.objects.get_or_create(employee=appraisal.employee)

                    # Update tracking based on the reviewer's specific role name
                    # Assuming request.user.employee_profile.role links to the Role model
                    reviewer_role_name = request.user.employee_profile.role.name
                    
                    if reviewer_role_name == "HOD":
                        track.hod_review_done = True
                    elif reviewer_role_name == "COO":
                        track.coo_review_done = True
                    elif reviewer_role_name == "CEO":
                        track.ceo_review_done = True
                    
                    track.save()

                    return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ------------------- Admin Timer Creation API Views -------------------

class EmployeeAppraisalTimerCreationAPIView(APIView):
    # Permission for HR/Admin to create timers
    permission_classes = [HasAppraisalPermission]
    permission_workspace = 'Configurations'
    permission_sub_workspace = 'Role' # Using a configuration-related sub-workspace
    permission_type = 'create'

    def post(self, request):
        if EmployeeAppraisalTimer.objects.exists():
            return Response(
                {'error': 'An Employee Appraisal Timer already exists.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = EmployeeAppraisalTimerSerializer(data=request.data)
        if serializer.is_valid():
            with transaction.atomic():
                serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ReportingManagerAppraisalTimerCreationAPIView(APIView):
    # Permission for HR/Admin to create timers
    permission_classes = [HasAppraisalPermission]
    permission_workspace = 'Configurations'
    permission_sub_workspace = 'Role' 
    permission_type = 'create'

    def post(self, request):
        if ReportingManagerAppraisalTimer.objects.exists():
            return Response(
                {'error': 'A Reporting Manager Appraisal Timer already exists.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = ReportingManagerAppraisalTimerSerializer(data=request.data)
        if serializer.is_valid():
            with transaction.atomic():
                serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FinalReviewerAppraisalTimerCreationAPIView(APIView):
    # Permission for HR/Admin to create timers
    permission_classes = [HasAppraisalPermission]
    permission_workspace = 'Configurations'
    permission_sub_workspace = 'Role' 
    permission_type = 'create'

    def post(self, request):
        if FinalReviewerAppraisalTimer.objects.exists():
            return Response(
                {'error': 'A Final Reviewer Appraisal Timer already exists.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = FinalReviewerAppraisalTimerSerializer(data=request.data)
        if serializer.is_valid():
            with transaction.atomic():
                serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ------------------- Previous Appraisal History API View -------------------

class AppraisalHistoryAPIView(APIView):
    # This view allows different roles to 'view' the history, using custom checks.
    # The primary workspace for all historical viewing is AllAppraisal.
    
    def get(self, request, appraisal_id):
        user = request.user
        if not user.is_authenticated or not hasattr(user, 'role') or not user.role:
             return Response({'detail': 'Authentication credentials were not provided.'}, status=status.HTTP_401_UNAUTHORIZED)
        
        # Check if user has ANY view permission on the primary appraisal history sub_workspace
        try:
             RolePermission.objects.get(role=user.role, workspace='AllAppraisal', sub_workspace='AllEmployeeAppraisal', view=True)
        except RolePermission.DoesNotExist:
             return Response({'detail': 'You do not have permission to view appraisal history.'}, status=status.HTTP_403_FORBIDDEN)
             
        
        appraisal = get_object_or_404(EmployeeAppraisal, pk=appraisal_id)
        
        response_data = {}
        
        # Always include the employee's self-appraisal
        response_data['employee_appraisal'] = EmployeeAppraisalSerializer(appraisal).data
        
        # Helper to check permission for a specific sub-workspace
        def user_can_view(sub_workspace):
            try:
                permission = RolePermission.objects.get(
                    role=user.role,
                    workspace='AllAppraisal',
                    sub_workspace=sub_workspace
                )
                return permission.view
            except RolePermission.DoesNotExist:
                return False
            
        # Try to fetch RM Review, if it exists
        if user_can_view('AllRmReview'):
            try:
                rm_review = ReportingManagerReview.objects.get(appraisal=appraisal)
                response_data['reporting_manager_review'] = ReportingManagerReviewSerializer(rm_review).data
            except ReportingManagerReview.DoesNotExist:
                pass
            
        # Try to fetch HR Review, if it exists
        if user_can_view('AllHrReview'):
            try:
                hr_review = HRReview.objects.get(appraisal=appraisal)
                response_data['hr_review'] = HRReviewSerializer(hr_review).data
            except HRReview.DoesNotExist:
                pass
            
        # Try to fetch Final Reviews
        if user_can_view('AllHodReview') or user_can_view('AllCooReview') or user_can_view('AllCeoReview'):
            try:
                # Assuming FinalReview is a single instance per appraisal
                final_review = FinalReview.objects.get(appraisal=appraisal)
                response_data['final_review'] = FinalReviewSerializer(final_review).data
            except FinalReview.DoesNotExist:
                pass
            
        return Response(response_data, status=status.HTTP_200_OK)