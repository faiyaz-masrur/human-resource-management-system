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
    AppraisalDetailsSerializer
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

    def post(self, request, employee_id):
        if self.required_timer_model:
            ok, msg = self.check_appraisal_timer()
            if not ok:
                return Response({'error': msg}, status=status.HTTP_400_BAD_REQUEST)

        appraisal = get_object_or_404(EmployeeAppraisal, employee_id=employee_id)
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
    permission_classes = [HasAppraisalPermission]
    workspace = 'MyAppraisal'
    sub_workspace = 'MyEmployeeAppraisal'
    permission_type = 'create'
    
    def get_object(self):
        return self.request.user

    def post(self, request, employee_id):
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

class RMReviewAPIView(BaseAppraisalReviewAPIView):
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


# ---------------- Review Appraisal Views ----------------

class ReviewAppraisalListAPIView(AppraisalPermissionMixin, ListAPIView):
    workspace = 'ReviewAppraisal'
    workspace = 'ReviewAppraisalList'
    permission_type = 'edit'
    serializer_class = EmployeeAppraisalSerializer

    def get_queryset(self):
        manager = getattr(self.request.user, 'employee_profile', None)
        if not manager:
            return EmployeeAppraisal.objects.none()
        return EmployeeAppraisal.objects.filter(
            employee__reporting_manager=manager,
            employee__employeeappraisalstatustrack__self_appraisal_done=True
        )


class ReviewAppraisalDetailAPIView(AppraisalPermissionMixin, APIView):
    permission_workspace = 'ReviewAppraisal'
    permission_sub_workspace = 'ReviewAppraisalDetail'
    permission_type = 'view'

    def get(self, request, employee_id):
        appraisal = get_object_or_404(EmployeeAppraisal, employee_id=employee_id)
        serializer = EmployeeAppraisalSerializer(appraisal)
        return Response(serializer.data)


class ReviewEmployeeAppraisalBaseAPIView(AppraisalPermissionMixin, APIView):
    permission_workspace = 'ReviewAppraisal'
    permission_sub_workspace = 'EmployeeAppraisalBase'
    permission_type = 'view'

    def get(self, request, employee_id):
        appraisal = get_object_or_404(EmployeeAppraisal, employee_id=employee_id)
        data = EmployeeAppraisalSerializer(appraisal).data
        return Response(data, status=status.HTTP_200_OK)


# ---------------- All Appraisal Views ----------------

class AllAppraisalListAPIView(AppraisalPermissionMixin, ListAPIView):
    permission_workspace = 'AllAppraisal'
    permission_sub_workspace = 'AllAppraisalList'
    permission_type = 'view'
    serializer_class = EmployeeAppraisalSerializer

    def get_queryset(self):
        return EmployeeAppraisal.objects.select_related('employee')


class AllAppraisalDetailAPIView(AppraisalPermissionMixin, APIView):
    permission_workspace = 'AllAppraisal'
    permission_sub_workspace = 'AllAppraisalDetail'
    permission_type = 'view'

    def get(self, request, employee_id):
        appraisal = get_object_or_404(EmployeeAppraisal, employee_id=employee_id)
        return Response(EmployeeAppraisalSerializer(appraisal).data)


class AllAppraisalEmployeeBaseAPIView(AppraisalPermissionMixin, APIView):
    permission_workspace = 'AllAppraisal'
    permission_sub_workspace = 'AllAppraisalEmployeeBase'
    permission_type = 'view'

    def get(self, request, employee_id):
        appraisal = get_object_or_404(EmployeeAppraisal, employee_id=employee_id)
        return Response(EmployeeAppraisalSerializer(appraisal).data)


# ---------------- All Role Review Details ----------------

class AllAppraisalRMDetailAPIView(AllAppraisalDetailAPIView):
    permission_sub_workspace = 'AllAppraisalRMDetail'
    def get(self, request, employee_id):
        review = get_object_or_404(ReportingManagerReview, appraisal__employee_id=employee_id)
        return Response(ReportingManagerReviewSerializer(review).data)

class AllAppraisalHRDetailAPIView(AllAppraisalDetailAPIView):
    permission_sub_workspace = 'AllAppraisalHRDetail'
    def get(self, request, employee_id):
        review = get_object_or_404(HrReview, appraisal__employee_id=employee_id)
        return Response(HRReviewSerializer(review).data)

class AllAppraisalHODDetailAPIView(AllAppraisalDetailAPIView):
    permission_sub_workspace = 'AllAppraisalHODDetail'
    def get(self, request, employee_id):
        review = get_object_or_404(HodReview, appraisal__employee_id=employee_id)
        return Response(HODReviewSerializer(review).data)

class AllAppraisalCOODetailAPIView(AllAppraisalDetailAPIView):
    permission_sub_workspace = 'AllAppraisalCOODetail'
    def get(self, request, employee_id):
        review = get_object_or_404(CooReview, appraisal__employee_id=employee_id)
        return Response(COOReviewSerializer(review).data)

class AllAppraisalCEODetailAPIView(AllAppraisalDetailAPIView):
    permission_sub_workspace = 'AllAppraisalCEODetail'
    def get(self, request, employee_id):
        review = get_object_or_404(CeoReview, appraisal__employee_id=employee_id)
        return Response(CEOReviewSerializer(review).data)


# ---------------- Employee View Review Feedbacks ----------------

class EmployeeViewRMReviewAPIView(APIView):
    def get(self, request, employee_id):
        review = get_object_or_404(ReportingManagerReview, appraisal__employee_id=employee_id)
        return Response(ReportingManagerReviewSerializer(review).data)

class EmployeeViewHRReviewAPIView(APIView):
    def get(self, request, employee_id):
        review = get_object_or_404(HrReview, appraisal__employee_id=employee_id)
        return Response(HRReviewSerializer(review).data)

class EmployeeViewCOOReviewAPIView(APIView):
    def get(self, request, employee_id):
        review = get_object_or_404(CooReview, appraisal__employee_id=employee_id)
        return Response(COOReviewSerializer(review).data)

class EmployeeViewCEOReviewAPIView(APIView):
    def get(self, request, employee_id):
        review = get_object_or_404(CeoReview, appraisal__employee_id=employee_id)
        return Response(CEOReviewSerializer(review).data)


# ---------------- Appraisal Status ----------------

class AppraisalStatusAPIView(AppraisalPermissionMixin, ListAPIView):
    workspace = 'AllAppraisal'
    sub_workspace = 'AppraisalStatus'
    permission_type = 'view'
    serializer_class = AppraisalDetailsSerializer

    def get_queryset(self):
        return AppraisalDetails.objects.all()



class AppraisalDetailAPIView(APIView):
    queryset = AppraisalDetails
