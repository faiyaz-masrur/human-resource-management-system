from django.shortcuts import get_object_or_404
from datetime import date
from django.db.models import Q, BooleanField, ExpressionWrapper, F
from rest_framework.generics import ListAPIView, RetrieveAPIView, RetrieveUpdateAPIView, GenericAPIView
from rest_framework.mixins import CreateModelMixin, RetrieveModelMixin, UpdateModelMixin
from system.permissions import HasRoleWorkspacePermission
from rest_framework.permissions import IsAuthenticated
from system.models import RolePermission
from .models import (
    EmployeeAppraisal,
    ReportingManagerReview,
    HrReview,
    HodReview,
    CooReview,
    CeoReview,
    AppraisalDetails,
    EmployeeAppraisalStatus
)
from .serializers import (
    EmployeeAppraisalSerializer,
    ReportingManagerReviewSerializer,
    HrReviewSerializer,
    HodReviewSerializer,
    CooReviewSerializer,
    CeoReviewSerializer,
    AppraisalDetailsSerializer,
    EmployeeAppraisalStatusSerializer
)

    

#---------------------------- My Appraisals Views ---------------------------


class MyAppraisalDetailsAPIView(RetrieveUpdateAPIView):
    serializer_class = AppraisalDetailsSerializer
    permission_classes = [HasRoleWorkspacePermission]
    workspace = "MyAppraisal"
    sub_workspace = "MyAppraisalDetail"

    def get_object(self):
        return get_object_or_404(AppraisalDetails, employee=self.request.user)
    

class MyEmployeeAppraisalAPIView(CreateModelMixin, RetrieveModelMixin, UpdateModelMixin, GenericAPIView):
    queryset = EmployeeAppraisal.objects.all()
    serializer_class = EmployeeAppraisalSerializer
    permission_classes = [HasRoleWorkspacePermission]
    workspace = 'MyAppraisal'
    sub_workspace = 'MyEmployeeAppraisal'
    lookup_field = "pk" 

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)
    
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
    
    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)
    

class MyRmReviewAPIView(CreateModelMixin, RetrieveModelMixin, UpdateModelMixin, GenericAPIView):
    queryset = ReportingManagerReview.objects.all()
    serializer_class = ReportingManagerReviewSerializer
    permission_classes = [HasRoleWorkspacePermission]
    workspace = 'MyAppraisal'
    sub_workspace = 'MyRmReview'
    lookup_field = "pk" 

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)
    
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
    
    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)
    

class MyHrReviewAPIView(CreateModelMixin, RetrieveModelMixin, UpdateModelMixin, GenericAPIView):
    queryset = HrReview.objects.all()
    serializer_class = HrReviewSerializer
    permission_classes = [HasRoleWorkspacePermission]
    workspace = 'MyAppraisal'
    sub_workspace = 'MyHrReview'
    lookup_field = "pk" 

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)
    
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
    
    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)
    

class MyHodReviewAPIView(CreateModelMixin, RetrieveModelMixin, UpdateModelMixin, GenericAPIView):
    queryset = HodReview.objects.all()
    serializer_class = HodReviewSerializer
    permission_classes = [HasRoleWorkspacePermission]
    workspace = 'MyAppraisal'
    sub_workspace = 'MyHodReview'
    lookup_field = "pk" 

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)
    
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
    
    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)
    

class MyCooReviewAPIView(CreateModelMixin, RetrieveModelMixin, UpdateModelMixin, GenericAPIView):
    queryset = CooReview.objects.all()
    serializer_class = CooReviewSerializer
    permission_classes = [HasRoleWorkspacePermission]
    workspace = 'MyAppraisal'
    sub_workspace = 'MyCooReview'
    lookup_field = "pk" 

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)
    
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
    
    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)
    

class MyCeoReviewAPIView(CreateModelMixin, RetrieveModelMixin, UpdateModelMixin, GenericAPIView):
    queryset = CeoReview.objects.all()
    serializer_class = CeoReviewSerializer
    permission_classes = [HasRoleWorkspacePermission]
    workspace = 'MyAppraisal'
    sub_workspace = 'MyCeoReview'
    lookup_field = "pk" 

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)
    
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
    
    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)
        
    

#---------------------------- Review Appraisals Views ---------------------------



class RmReviewAppraisalListAPIView(ListAPIView):
    serializer_class = AppraisalDetailsSerializer
    permission_classes = [HasRoleWorkspacePermission]
    workspace = 'ReviewAppraisal'
    sub_workspace = 'ReviewAppraisalList'
    
    def get_queryset(self):
        queryset = (
            AppraisalDetails.objects
            .select_related('employee', 'employee__department', 'employee__grade', 'employee__designation', 'reporting_manager')
            .filter(
                employee__reviewed_by_rm=True,
                emp_appraisal__isnull=False,
                reporting_manager__isnull=False,
                reporting_manager__manager=self.request.user,
            )
            .annotate(
                rm_review_is_null=ExpressionWrapper(
                    Q(rm_review__isnull=True),
                    output_field=BooleanField()
                )
            )
            .order_by('-rm_review_is_null') 
        )
        return queryset
    

class HrReviewAppraisalListAPIView(ListAPIView):
    serializer_class = AppraisalDetailsSerializer
    permission_classes = [HasRoleWorkspacePermission]
    workspace = 'ReviewAppraisal'
    sub_workspace = 'ReviewAppraisalList'
    
    def get_queryset(self):
        reviewPermission = RolePermission.objects.filter(
            role=self.request.user.role, 
            workspace='ReviewAppraisal', 
            sub_workspace='EmployeeHrReview'
        ).first()
        if not reviewPermission or not (reviewPermission.create or reviewPermission.edit):
            return AppraisalDetails.objects.none()
        queryset = (
            AppraisalDetails.objects
            .select_related('employee') 
            .filter(
                Q(employee__reviewed_by_hr=True) &
                Q(emp_appraisal__isnull=False) &
                (Q(employee__reviewed_by_rm=False) | Q(rm_review__isnull=False))
            )
            .annotate(
                hr_review_is_null=ExpressionWrapper(Q(hr_review__isnull=True), output_field=BooleanField())
            )
            .order_by('-hr_review_is_null')
        )
        return queryset
    

class HodReviewAppraisalListAPIView(ListAPIView):
    serializer_class = AppraisalDetailsSerializer
    permission_classes = [HasRoleWorkspacePermission]
    workspace = 'ReviewAppraisal'
    sub_workspace = 'ReviewAppraisalList'
    
    def get_queryset(self):
        reviewPermission = RolePermission.objects.filter(
            role=self.request.user.role, 
            workspace='ReviewAppraisal', 
            sub_workspace='EmployeeHodReview'
        ).first()
        if not reviewPermission or not (reviewPermission.create or reviewPermission.edit):
            return AppraisalDetails.objects.none()
        queryset = (
            AppraisalDetails.objects
            .select_related('employee')
            .filter(
                Q(employee__reviewed_by_hod=True) & 
                Q(emp_appraisal__isnull=False) &
                (Q(employee__reviewed_by_rm=False) | Q(rm_review__isnull=False)) &
                (Q(employee__reviewed_by_hr=False) | Q(hr_review__isnull=False))
            )
            .annotate(
                hod_review_is_null=ExpressionWrapper(Q(hod_review__isnull=True), output_field=BooleanField())
            )
            .order_by('-hod_review_is_null')
        )
        return queryset
    

class CooReviewAppraisalListAPIView(ListAPIView):
    serializer_class = AppraisalDetailsSerializer
    permission_classes = [HasRoleWorkspacePermission]
    workspace = 'ReviewAppraisal'
    sub_workspace = 'ReviewAppraisalList'
    
    def get_queryset(self):
        reviewPermission = RolePermission.objects.filter(
            role=self.request.user.role, 
            workspace='ReviewAppraisal', 
            sub_workspace='EmployeeCooReview'
        ).first()
        if not reviewPermission or not (reviewPermission.create or reviewPermission.edit):
            return AppraisalDetails.objects.none()
        queryset = (
            AppraisalDetails.objects
            .select_related('employee')
            .filter(
                Q(employee__reviewed_by_coo=True) & 
                Q(emp_appraisal__isnull=False) &
                (Q(employee__reviewed_by_rm=False) | Q(rm_review__isnull=False)) &
                (Q(employee__reviewed_by_hr=False) | Q(hr_review__isnull=False)) &
                (Q(employee__reviewed_by_hod=False) | Q(hod_review__isnull=False))
            )
            .annotate(
                coo_review_is_null=ExpressionWrapper(Q(coo_review__isnull=True), output_field=BooleanField())
            )
            .order_by('-coo_review_is_null')
        )
        return queryset
    

class CeoReviewAppraisalListAPIView(ListAPIView):
    serializer_class = AppraisalDetailsSerializer
    permission_classes = [HasRoleWorkspacePermission]
    workspace = 'ReviewAppraisal'
    sub_workspace = 'ReviewAppraisalList'
    
    def get_queryset(self):
        reviewPermission = RolePermission.objects.filter(
            role=self.request.user.role, 
            workspace='ReviewAppraisal', 
            sub_workspace='EmployeeCeoReview'
        ).first()
        if not reviewPermission or not (reviewPermission.create or reviewPermission.edit):
            return AppraisalDetails.objects.none()
        queryset = (
            AppraisalDetails.objects
            .select_related('employee')
            .filter(
                Q(employee__reviewed_by_ceo=True) & 
                Q(emp_appraisal__isnull=False) &
                (Q(employee__reviewed_by_rm=False) | Q(rm_review__isnull=False)) &
                (Q(employee__reviewed_by_hr=False) | Q(hr_review__isnull=False)) &
                (Q(employee__reviewed_by_hod=False) | Q(hod_review__isnull=False)) &
                (Q(employee__reviewed_by_coo=False) | Q(coo_review__isnull=False)) 
            )
            .annotate(
                ceo_review_is_null=ExpressionWrapper(Q(ceo_review__isnull=True), output_field=BooleanField())
            )
            .order_by('-ceo_review_is_null')
        )
        return queryset
    

class ReviewAppraisalDetailsAPIView(RetrieveUpdateAPIView):
    serializer_class = AppraisalDetailsSerializer
    permission_classes = [HasRoleWorkspacePermission]
    workspace = "ReviewAppraisal"
    sub_workspace = "EmployeeAppraisalDetail"

    def get_object(self):
        id = self.kwargs.get("employee")
        return get_object_or_404(AppraisalDetails, employee__id=id)
    

class ReviewEmployeeAppraisalAPIView(CreateModelMixin, RetrieveModelMixin, UpdateModelMixin, GenericAPIView):
    queryset = EmployeeAppraisal.objects.all()
    serializer_class = EmployeeAppraisalSerializer
    permission_classes = [HasRoleWorkspacePermission]
    workspace = 'ReviewAppraisal'
    sub_workspace = 'EmployeeEmployeeAppraisal'
    lookup_field = "pk" 

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)
    
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
    
    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)
    

class EmployeeRmReviewAPIView(CreateModelMixin, RetrieveModelMixin, UpdateModelMixin, GenericAPIView):
    queryset = ReportingManagerReview.objects.all()
    serializer_class = ReportingManagerReviewSerializer
    permission_classes = [HasRoleWorkspacePermission]
    workspace = 'ReviewAppraisal'
    sub_workspace = 'EmployeeRmReview'
    lookup_field = "pk" 

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)
    
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
    
    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)
    

class EmployeeHrReviewAPIView(CreateModelMixin, RetrieveModelMixin, UpdateModelMixin, GenericAPIView):
    queryset = HrReview.objects.all()
    serializer_class = HrReviewSerializer
    permission_classes = [HasRoleWorkspacePermission]
    workspace = 'ReviewAppraisal'
    sub_workspace = 'EmployeeHrReview'
    lookup_field = "pk" 

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)
    
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
    
    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)
    

class EmployeeHodReviewAPIView(CreateModelMixin, RetrieveModelMixin, UpdateModelMixin, GenericAPIView):
    queryset = HodReview.objects.all()
    serializer_class = HodReviewSerializer
    permission_classes = [HasRoleWorkspacePermission]
    workspace = 'ReviewAppraisal'
    sub_workspace = 'EmployeeHodReview'
    lookup_field = "pk" 

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)
    
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
    
    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)
    

class EmployeeCooReviewAPIView(CreateModelMixin, RetrieveModelMixin, UpdateModelMixin, GenericAPIView):
    queryset = CooReview.objects.all()
    serializer_class = CooReviewSerializer
    permission_classes = [HasRoleWorkspacePermission]
    workspace = 'ReviewAppraisal'
    sub_workspace = 'EmployeeCooReview'
    lookup_field = "pk" 

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)
    
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
    
    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)
    

class EmployeeCeoReviewAPIView(CreateModelMixin, RetrieveModelMixin, UpdateModelMixin, GenericAPIView):
    queryset = CeoReview.objects.all()
    serializer_class = CeoReviewSerializer
    permission_classes = [HasRoleWorkspacePermission]
    workspace = 'ReviewAppraisal'
    sub_workspace = 'EmployeeCeoReview'
    lookup_field = "pk" 

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)
    
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
    
    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)
    
    

#---------------------------- All Appraisals Views ---------------------------


class AllAppraisalListAPIView(ListAPIView):
    queryset = AppraisalDetails.objects.all()
    serializer_class = AppraisalDetailsSerializer
    permission_classes = [HasRoleWorkspacePermission]
    workspace = 'AllAppraisal'
    sub_workspace = 'AllAppraisalList'
    

class AllAppraisalDetailsAPIView(RetrieveUpdateAPIView):
    serializer_class = AppraisalDetailsSerializer
    permission_classes = [HasRoleWorkspacePermission]
    workspace = "AllAppraisal"
    sub_workspace = "AllAppraisalDetail"

    def get_object(self):
        id = self.kwargs.get("employee")
        return get_object_or_404(AppraisalDetails, employee__id=id)
    

class AllEmployeeAppraisalAPIView(CreateModelMixin, RetrieveModelMixin, UpdateModelMixin, GenericAPIView):
    queryset = EmployeeAppraisal.objects.all()
    serializer_class = EmployeeAppraisalSerializer
    permission_classes = [HasRoleWorkspacePermission]
    workspace = 'AllAppraisal'
    sub_workspace = 'AllEmployeeAppraisal'
    lookup_field = "pk" 

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)
    
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
    
    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)
    

class AllRmReviewAPIView(CreateModelMixin, RetrieveModelMixin, UpdateModelMixin, GenericAPIView):
    queryset = ReportingManagerReview.objects.all()
    serializer_class = ReportingManagerReviewSerializer
    permission_classes = [HasRoleWorkspacePermission]
    workspace = 'AllAppraisal'
    sub_workspace = 'AllRmReview'
    lookup_field = "pk" 

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)
    
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
    
    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)
    

class AllHrReviewAPIView(CreateModelMixin, RetrieveModelMixin, UpdateModelMixin, GenericAPIView):
    queryset = HrReview.objects.all()
    serializer_class = HrReviewSerializer
    permission_classes = [HasRoleWorkspacePermission]
    workspace = 'AllAppraisal'
    sub_workspace = 'AllHrReview'
    lookup_field = "pk" 

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)
    
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
    
    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)
    

class AllHodReviewAPIView(CreateModelMixin, RetrieveModelMixin, UpdateModelMixin, GenericAPIView):
    queryset = HodReview.objects.all()
    serializer_class = HodReviewSerializer
    permission_classes = [HasRoleWorkspacePermission]
    workspace = 'AllAppraisal'
    sub_workspace = 'AllHodReview'
    lookup_field = "pk" 

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)
    
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
    
    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)
    

class AllCooReviewAPIView(CreateModelMixin, RetrieveModelMixin, UpdateModelMixin, GenericAPIView):
    queryset = CooReview.objects.all()
    serializer_class = CooReviewSerializer
    permission_classes = [HasRoleWorkspacePermission]
    workspace = 'AllAppraisal'
    sub_workspace = 'AllCooReview'
    lookup_field = "pk" 

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)
    
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
    
    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)
    

class AllCeoReviewAPIView(CreateModelMixin, RetrieveModelMixin, UpdateModelMixin, GenericAPIView):
    queryset = CeoReview.objects.all()
    serializer_class = CeoReviewSerializer
    permission_classes = [HasRoleWorkspacePermission]
    workspace = 'AllAppraisal'
    sub_workspace = 'AllCeoReview'
    lookup_field = "pk" 

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)
    
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
    
    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)
    



# ---------------- Appraisal Status ----------------

class AppraisalStatusAPIView(ListAPIView):
    serializer_class = EmployeeAppraisalStatusSerializer
    permission_classes = [HasRoleWorkspacePermission]
    workspace = 'AllAppraisal'
    sub_workspace = 'AppraisalStatus'

    def get_queryset(self):
        today = date.today()
        return EmployeeAppraisalStatus.objects.filter(appraisal_date__year=today.year, appraisal_date__month=today.month)
    


class AppraisalStatusView(RetrieveAPIView):
    queryset = EmployeeAppraisalStatus.objects.all()
    serializer_class = EmployeeAppraisalStatusSerializer
    permission_classes = [IsAuthenticated]