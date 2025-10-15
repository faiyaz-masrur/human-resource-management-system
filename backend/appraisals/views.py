from django.shortcuts import get_object_or_404
from django.db import transaction
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.permissions import BasePermission
from rest_framework.mixins import UpdateModelMixin 
from rest_framework.generics import GenericAPIView 

# Assuming RolePermission is available and used for authorization
from system.models import RolePermission 

from .models import (
    EmployeeAppraisal,
    ReportingManagerReview,
    HrReview, 
    HodReview, 
    CooReview, 
    CeoReview, 
    EmployeeAppraisalTimer,
    ReportingManagerAppraisalTimer,
    FinalReviewerAppraisalTimer,
    EmployeeAppraisalStatusTrack 
)
from .serializers import (
    EmployeeAppraisalSerializer,
    ReportingManagerReviewSerializer,
    HRReviewSerializer,
    HODReviewSerializer, 
    COOReviewSerializer, 
    CEOReviewSerializer, 
    EmployeeAppraisalTimerSerializer,
    ReportingManagerAppraisalTimerSerializer,
    FinalReviewerAppraisalTimerSerializer,
    EmployeeAppraisalDetailSerializer, 
)


class HasAppraisalPermission(BasePermission):

    def has_permission(self, request, view):
        user = request.user
        if not user.is_authenticated or not hasattr(user, 'role') or not user.role:
            return False

        # Retrieve permission attributes from the view configuration
        workspace = getattr(view, 'permission_workspace', None)
        sub_workspace = getattr(view, 'permission_sub_workspace', None)
        permission_type = getattr(view, 'permission_type', None)

        if not workspace or not sub_workspace or not permission_type:
            # Fatal error: view is not correctly configured
            return False

        try:
            # Query the RolePermission table using the view's defined scope
            permission = RolePermission.objects.get(
                role=user.role,
                workspace=workspace,
                sub_workspace=sub_workspace
            )
            # Check if the user has the specific permission type (view/create/edit)
            return getattr(permission, permission_type, False)

        except RolePermission.DoesNotExist:
            return False
        except Exception:
            return False

# ------------------- Base Class for Executive Review Submissions -------------------

class ExecutiveReviewBaseAPIView(APIView):
    """
    Base class to handle POST/PUT submissions for HOD, COO, and CEO reviews.
    
    It abstracts:
    1. Permission check (using HasAppraisalPermission)
    2. Timer check (using the specific timer model set in subclasses)
    3. Review instance get_or_create/save
    4. Status Track update
    """
    permission_classes = [HasAppraisalPermission]
    permission_workspace = 'ReviewAppraisal'
    permission_type = 'edit'
    
    review_model = None
    review_serializer = None
    status_track_field = None 
    required_timer = EmployeeAppraisalTimer 
    
    def post(self, request, appraisal_id):

        self.permission_sub_workspace = self.permission_sub_workspace 

        if self.required_timer:
            timer = self.required_timer.objects.first()
            if not timer or not timer.is_active_period():
                return Response(
                    {'error': f'The review period is not currently active.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        try:
            appraisal = get_object_or_404(EmployeeAppraisal, pk=appraisal_id)
            
            # 2. Get or create the specific review instance
            review_instance, created = self.review_model.objects.get_or_create(
                appraisal=appraisal,
                reviewer=request.user.employee_profile 
            )
            
            serializer = self.review_serializer(instance=review_instance, data=request.data, partial=True)

            if serializer.is_valid():
                with transaction.atomic():
                    serializer.save()

                    # 3. Update EmployeeAppraisalStatusTrack
                    track, _ = EmployeeAppraisalStatusTrack.objects.get_or_create(employee=appraisal.employee)
                    
                    if self.status_track_field:
                        setattr(track, self.status_track_field, True)
                    
                    track.save()

                    return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ------------------- API Views -------------------

class EmployeeSelfAppraisalAPIView(APIView):
    # Employee submitting their own appraisal (POST)
    permission_classes = [HasAppraisalPermission]
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
            with transaction.atomic():
                appraisal_instance = serializer.save(
                    employee=request.user.employee_profile
                )
                # --- Update EmployeeAppraisalStatusTrack ---
                track, _ = EmployeeAppraisalStatusTrack.objects.get_or_create(
                    employee=appraisal_instance.employee
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
    serializer_class = EmployeeAppraisalSerializer

    def get_queryset(self):
        try:
            # RM review is constrained by the ReportingManagerAppraisalTimer
            timer = ReportingManagerAppraisalTimer.objects.first()
            if not timer or not timer.is_active_period():
                return EmployeeAppraisal.objects.none()

            manager_profile = self.request.user.employee_profile
            # Only list appraisals for employees reporting to this manager
            return EmployeeAppraisal.objects.filter(
                employee__reporting_manager=manager_profile,
                # Filter for those that have completed self-appraisal but not RM review
                employeeappraisalstatustrack__self_appraisal_done=True,
                employeeappraisalstatustrack__rm_review_done=False,
            )
        except AttributeError:
            return EmployeeAppraisal.objects.none()

# --- RM Review View ---

class ReportingManagerReviewAPIView(APIView):
    # RM submitting or updating their review
    permission_classes = [HasAppraisalPermission]
    permission_workspace = 'ReviewAppraisal'
    permission_sub_workspace = 'EmployeeRmReview'
    permission_type = 'edit'

    def post(self, request, appraisal_id):
        # RM is constrained by the ReportingManagerAppraisalTimer
        timer = ReportingManagerAppraisalTimer.objects.first()
        if not timer or not timer.is_active_period():
            return Response(
                {'error': 'The reporting manager review period is not currently active.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            appraisal = get_object_or_404(EmployeeAppraisal, pk=appraisal_id)
            
            # Authorization check: only the designated RM can submit
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

                    # --- Update EmployeeAppraisalStatusTrack ---
                    track, _ = EmployeeAppraisalStatusTrack.objects.get_or_create(employee=appraisal.employee)
                    track.rm_review_done = True
                    track.save()

                    return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# --- HR Review View (Timer Check Removed for 'always edit' access) ---

class HRReviewAPIView(APIView):
    # HR submitting or updating their review - ALWAYS ALLOWED TO EDIT/CREATE
    permission_classes = [HasAppraisalPermission]
    permission_workspace = 'ReviewAppraisal'
    permission_sub_workspace = 'EmployeeHrReview'
    permission_type = 'edit'

    def post(self, request, appraisal_id):
        
        try:
            appraisal = get_object_or_404(EmployeeAppraisal, pk=appraisal_id)
            
            hr_review, created = HrReview.objects.get_or_create( 
                appraisal=appraisal,
                reviewer=request.user.employee_profile
            )
            serializer = HRReviewSerializer(instance=hr_review, data=request.data, partial=True)

            if serializer.is_valid():
                with transaction.atomic():
                    serializer.save()

                    # --- Update EmployeeAppraisalStatusTrack ---
                    track, _ = EmployeeAppraisalStatusTrack.objects.get_or_create(employee=appraisal.employee)
                    track.hr_review_done = True
                    track.save()

                    return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ------------------- Granular Executive Review API Views -------------------

class HODReviewAPIView(ExecutiveReviewBaseAPIView):
    """HOD submitting or updating their review, restricted by FinalReviewerAppraisalTimer."""
    review_model = HodReview
    review_serializer = HODReviewSerializer
    status_track_field = 'hod_review_done'
    permission_sub_workspace = 'EmployeeHodReview' 
    required_timer = EmployeeAppraisalTimer 

class COOReviewAPIView(ExecutiveReviewBaseAPIView):
    """COO submitting or updating their review, restricted by FinalReviewerAppraisalTimer."""
    review_model = CooReview
    review_serializer = COOReviewSerializer
    status_track_field = 'coo_review_done'
    permission_sub_workspace = 'EmployeeCooReview' 
    required_timer = EmployeeAppraisalTimer

class CEOReviewAPIView(ExecutiveReviewBaseAPIView):
    """CEO submitting or updating their review, restricted by FinalReviewerAppraisalTimer."""
    review_model = CeoReview
    review_serializer = CEOReviewSerializer
    status_track_field = 'ceo_review_done'
    permission_sub_workspace = 'EmployeeCeoReview' 
    required_timer = EmployeeAppraisalTimer


# ------------------- Comprehensive Appraisal Detail API View -------------------

class AppraisalDetailAPIView(APIView):
    """
    Retrieves the complete, detailed appraisal history for a given employee.
    This uses the nested EmployeeAppraisalDetailSerializer for a unified response.
    """
    permission_classes = [HasAppraisalPermission]
    permission_workspace = 'AllAppraisal'
    permission_sub_workspace = 'AllEmployeeAppraisal'
    permission_type = 'view'
    
    def get(self, request, appraisal_id):
        # Prefetch related data to optimize database queries
        try:
            appraisal = EmployeeAppraisal.objects.select_related(
                'attendance_summary', 
                'salaryrecommendation', # Check your model relationship names
                'reportingmanagerreview', 
                'hrreview', 
                'hodreview', 
                'cooreview', 
                'ceoreview' 
            ).get(pk=appraisal_id)
        except EmployeeAppraisal.DoesNotExist:
            return Response({'detail': 'Appraisal not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        # Use the comprehensive serializer
        serializer = EmployeeAppraisalDetailSerializer(appraisal)
        
        return Response(serializer.data, status=status.HTTP_200_OK)


# ------------------- Admin Timer Creation API Views (Unchanged) -------------------

class EmployeeAppraisalTimerCreationAPIView(APIView):
    permission_classes = [HasAppraisalPermission]
    permission_workspace = 'Configurations'
    permission_sub_workspace = 'Role'
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


# ------------------- Selective Appraisal History API View (Unchanged) -------------------

class AppraisalHistoryAPIView(APIView):
    """
    Retrieves appraisal history selectively based on the user's granular view permissions 
    (e.g., only HR can view HR review data, only HOD can view HOD data).
    
    This view uses the sub_workspace codes like 'AllRmReview', 'AllHrReview', 
    etc. to check permission for displaying sensitive review sections.
    """
    
    def get(self, request, appraisal_id):
        user = request.user
        if not user.is_authenticated or not hasattr(user, 'role') or not user.role:
              return Response({'detail': 'Authentication credentials were not provided.'}, status=status.HTTP_401_UNAUTHORIZED)
        
        # 1. Check top-level permission (AllAppraisal/AllEmployeeAppraisal/view)
        try:
            RolePermission.objects.get(role=user.role, workspace='AllAppraisal', sub_workspace='AllEmployeeAppraisal', view=True)
        except RolePermission.DoesNotExist:
              return Response({'detail': 'You do not have permission to view appraisal history.'}, status=status.HTTP_403_FORBIDDEN)
              
        appraisal = get_object_or_404(EmployeeAppraisal, pk=appraisal_id)
        
        response_data = {}
        response_data['employee_appraisal'] = EmployeeAppraisalSerializer(appraisal).data
        
        def user_can_view(sub_workspace):
            """Helper to check granular view permission within the 'AllAppraisal' workspace."""
            try:
                permission = RolePermission.objects.get(
                    role=user.role,
                    workspace='AllAppraisal',
                    sub_workspace=sub_workspace
                )
                return permission.view
            except RolePermission.DoesNotExist:
                return False
            
        # 2. Try to fetch RM Review based on 'AllRmReview' permission
        if user_can_view('AllRmReview'):
            try:
                rm_review = ReportingManagerReview.objects.get(appraisal=appraisal)
                response_data['reporting_manager_review'] = ReportingManagerReviewSerializer(rm_review).data
            except ReportingManagerReview.DoesNotExist:
                pass
            
        # 3. Try to fetch HR Review based on 'AllHrReview' permission
        if user_can_view('AllHrReview'):
            try:
                hr_review = HrReview.objects.get(appraisal=appraisal)
                response_data['hr_review'] = HRReviewSerializer(hr_review).data
            except HrReview.DoesNotExist:
                pass
            
        # 4. Try to fetch Granular Final Reviews
        
        if user_can_view('AllHodReview'):
            try:
                hod_review = HodReview.objects.get(appraisal=appraisal)
                response_data['hod_review'] = HODReviewSerializer(hod_review).data
            except HodReview.DoesNotExist:
                pass

        if user_can_view('AllCooReview'):
            try:
                coo_review = CooReview.objects.get(appraisal=appraisal)
                response_data['coo_review'] = COOReviewSerializer(coo_review).data
            except CooReview.DoesNotExist:
                pass
                
        if user_can_view('AllCeoReview'):
            try:
                ceo_review = CeoReview.objects.get(appraisal=appraisal)
                response_data['ceo_review'] = CEOReviewSerializer(ceo_review).data
            except CeoReview.DoesNotExist:
                pass
            
        return Response(response_data, status=status.HTTP_200_OK)
