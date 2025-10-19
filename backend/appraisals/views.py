from django.shortcuts import get_object_or_404
from django.db import transaction
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.permissions import BasePermission

from system.models import RolePermission, Employee
from .models import (
    EmployeeAppraisal,
    ReportingManagerReview,
    HrReview, 
    HodReview, 
    CooReview, 
    CeoReview, 
    AppraisalDetails,
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

# ---------------- Permission Class ----------------

class HasAppraisalPermission(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        if not user.is_authenticated or not hasattr(user, 'role') or not user.role:
            return False
        workspace = getattr(view, 'permission_workspace', None)
        sub_workspace = getattr(view, 'permission_sub_workspace', None)
        permission_type = getattr(view, 'permission_type', None)
        if not workspace or not sub_workspace or not permission_type:
            return False
        try:
            permission = RolePermission.objects.get(
                role=user.role,
                workspace=workspace,
                sub_workspace=sub_workspace
            )
            return getattr(permission, permission_type, False)
        except RolePermission.DoesNotExist:
            return False

# ---------------- Base Mixins ----------------

class AppraisalPermissionMixin:
    permission_classes = [HasAppraisalPermission]
    permission_workspace = None
    permission_sub_workspace = None
    permission_type = None

class AppraisalReviewSubmissionMixin:
    review_model = None
    review_serializer = None
    status_track_field = None
    required_timer_model = EmployeeAppraisalTimer 

    def check_appraisal_timer(self):
        if self.required_timer_model:
            timer = self.required_timer_model.objects.first()
            if not timer or not timer.is_active_period():
                return False, 'The review period is not currently active.'
        return True, None

    def check_review_authorization(self, request, appraisal):
        return True, None

    def post(self, request, appraisal_id):
        if self.required_timer_model:
            ok, msg = self.check_appraisal_timer()
            if not ok:
                return Response({'error': msg}, status=status.HTTP_400_BAD_REQUEST)
        appraisal = get_object_or_404(EmployeeAppraisal, pk=appraisal_id)
        auth_ok, auth_error = self.check_review_authorization(request, appraisal)
        if not auth_ok:
            return Response({'error': auth_error}, status=status.HTTP_403_FORBIDDEN)
        review_instance, _ = self.review_model.objects.get_or_create(
            appraisal=appraisal, reviewer=request.user.employee_profile
        )
        serializer = self.review_serializer(review_instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        with transaction.atomic():
            serializer.save()
            if self.status_track_field:
                track, _ = EmployeeAppraisalStatusTrack.objects.get_or_create(employee=appraisal.employee)
                setattr(track, self.status_track_field, True)
                track.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

class BaseAppraisalReviewAPIView(AppraisalPermissionMixin, AppraisalReviewSubmissionMixin, APIView):
    permission_workspace = 'ReviewAppraisal'
    permission_type = 'edit'

# ---------------- Employee Self Appraisal ----------------

class EmployeeSelfAppraisalAPIView(AppraisalPermissionMixin, APIView):
    permission_workspace = 'MyAppraisal'
    permission_sub_workspace = 'MyEmployeeAppraisal'
    permission_type = 'create'

    def post(self, request):
        timer = EmployeeAppraisalTimer.objects.first()
        if not timer or not timer.is_active_period():
            return Response({'error': 'The employee self-appraisal period is not active.'}, status=status.HTTP_400_BAD_REQUEST)
        serializer = EmployeeAppraisalSerializer(data=request.data)
        if serializer.is_valid():
            appraisal_instance = serializer.save(employee=request.user.employee_profile)
            track, _ = EmployeeAppraisalStatusTrack.objects.get_or_create(employee=appraisal_instance.employee)
            track.self_appraisal_done = True
            track.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ---------------- Review API Views ----------------

class ReportingManagerReviewAPIView(BaseAppraisalReviewAPIView):
    review_model = ReportingManagerReview
    review_serializer = ReportingManagerReviewSerializer
    status_track_field = 'rm_review_done'
    permission_sub_workspace = 'EmployeeRmReview'

    def check_review_authorization(self, request, appraisal):
        if appraisal.employee.reporting_manager != getattr(request.user, 'employee_profile', None):
            return False, 'You are not the designated Reporting Manager.'
        if not getattr(appraisal.employee.employeeappraisalstatustrack, 'self_appraisal_done', False):
            return False, 'Employee has not completed self-appraisal.'
        return True, None

class HRReviewAPIView(BaseAppraisalReviewAPIView):
    review_model = HrReview
    review_serializer = HRReviewSerializer
    status_track_field = 'hr_review_done'
    required_timer_model = None
    permission_sub_workspace = 'EmployeeHrReview'

class HODReviewAPIView(BaseAppraisalReviewAPIView):
    review_model = HodReview
    review_serializer = HODReviewSerializer
    status_track_field = 'hod_review_done'
    permission_sub_workspace = 'EmployeeHodReview'

class COOReviewAPIView(BaseAppraisalReviewAPIView):
    review_model = CooReview
    review_serializer = COOReviewSerializer
    status_track_field = 'coo_review_done'
    permission_sub_workspace = 'EmployeeCooReview'

class CEOReviewAPIView(BaseAppraisalReviewAPIView):
    review_model = CeoReview
    review_serializer = CEOReviewSerializer
    status_track_field = 'ceo_review_done'
    permission_sub_workspace = 'EmployeeCeoReview'

# ---------------- List Views ----------------

class ReviewAppraisalListAPIView(AppraisalPermissionMixin, ListAPIView):
    permission_workspace = 'ReviewAppraisal'
    permission_sub_workspace = 'ReviewAppraisalList'
    permission_type = 'edit'
    serializer_class = EmployeeAppraisalSerializer

    def get_queryset(self):
        manager = getattr(self.request.user, 'employee_profile', None)
        if not manager:
            return EmployeeAppraisal.objects.none()
        return EmployeeAppraisal.objects.filter(
            employee__reporting_manager=manager,
            employee__employeeappraisalstatustrack__self_appraisal_done=True,
            employee__employeeappraisalstatustrack__rm_review_done=False,
        )

class AllAppraisalStatusAPIView(AppraisalPermissionMixin, ListAPIView):
    permission_workspace = 'AllAppraisal'
    permission_sub_workspace = 'AppraisalStatus'
    permission_type = 'view'
    serializer_class = AppraisalDetailsSerializer

    def get_queryset(self):
        return EmployeeAppraisal.objects.select_related(
            'employee', 'employee__employeeappraisalstatustrack',
            'reportingmanagerreview', 'hrreview', 'hodreview', 'cooreview', 'ceoreview'
        ).filter(employee__employeeappraisalstatustrack__self_appraisal_done=True)

class AllAppraisalListAPIView(AllAppraisalStatusAPIView):
    permission_sub_workspace = 'AllAppraisalList'
    permission_type = 'edit'

# ---------------- Appraisal Details (HR editable fields only) ----------------

class AppraisalDetailsAPIView(APIView):
    """
    HR can edit appraisal_start_date & appraisal_end_date.
    Other fields are read-only.
    """
    def get(self, request, employee_id):
        employee = get_object_or_404(Employee, pk=employee_id)
        appraisal_details, _ = AppraisalDetails.objects.get_or_create(employee=employee)
        data = {
            'employee_id': employee.id,
            'employee_name': employee.name,
            'designation': employee.designation.name if employee.designation else None,
            'department': employee.department.name if employee.department else None,
            'joining_date': employee.joining_date,
            'grade': employee.grade.name if employee.grade else None,
            'appraisal_start_date': appraisal_details.appraisal_start_date,
            'appraisal_end_date': appraisal_details.appraisal_end_date,
        }
        return Response(data, status=status.HTTP_200_OK)

    def patch(self, request, employee_id):
        user = request.user
        if getattr(user.role, 'name', '').upper() != 'HR':
            return Response({'detail': 'You do not have permission.'}, status=status.HTTP_403_FORBIDDEN)
        appraisal_details = get_object_or_404(AppraisalDetails, employee_id=employee_id)
        # Only allow HR to update start & end dates
        allowed_data = {k: v for k, v in request.data.items() if k in ['appraisal_start_date', 'appraisal_end_date']}
        serializer = AppraisalDetailsSerializer(appraisal_details, data=allowed_data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'detail': 'Updated successfully', 'data': serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ---------------- Full Appraisal Detail View ----------------

class FullAppraisalAPIView(APIView):
    def get(self, request, appraisal_id):
        user = request.user
        if not user.is_authenticated:
            return Response({'detail': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)

        appraisal = get_object_or_404(
            EmployeeAppraisal.objects.select_related(
                'employee', 'reportingmanagerreview', 'hrreview', 'hodreview', 'cooreview', 'ceoreview'
            ),
            pk=appraisal_id
        )

        is_employee = getattr(user, 'employee_profile', None) == appraisal.employee
        is_hr = getattr(user.role, 'name', '').upper() == 'HR'

        response = {'employee_appraisal': EmployeeAppraisalSerializer(appraisal).data}

        def add_review(key, model_attr, serializer_cls):
            review_obj = getattr(appraisal, model_attr, None)
            response[key] = serializer_cls(review_obj).data if review_obj else None

        if is_employee or is_hr:
            add_review('reporting_manager_review', 'reportingmanagerreview', ReportingManagerReviewSerializer)
            add_review('hr_review', 'hrreview', HRReviewSerializer)
            add_review('hod_review', 'hodreview', HODReviewSerializer)
            add_review('coo_review', 'cooreview', COOReviewSerializer)
            add_review('ceo_review', 'ceoreview', CEOReviewSerializer)
        else:
            # Check RolePermission for other roles
            phase_map = {
                'Reporting Manager Review': ('reporting_manager_review', 'reportingmanagerreview', ReportingManagerReviewSerializer),
                'HR Review': ('hr_review', 'hrreview', HRReviewSerializer),
                'HOD Review': ('hod_review', 'hodreview', HODReviewSerializer),
                'COO Review': ('coo_review', 'cooreview', COOReviewSerializer),
                'CEO Review': ('ceo_review', 'ceoreview', CEOReviewSerializer)
            }
            for ws_name, (key, attr, serializer_cls) in phase_map.items():
                try:
                    perm = RolePermission.objects.get(role=user.role, workspace='ReviewAppraisal', sub_workspace=ws_name)
                    if perm.view:
                        add_review(key, attr, serializer_cls)
                except RolePermission.DoesNotExist:
                    response[key] = None

        return Response(response)
