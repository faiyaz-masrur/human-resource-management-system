from django.shortcuts import get_object_or_404
from rest_framework.generics import ListAPIView, RetrieveUpdateAPIView, GenericAPIView
from rest_framework.mixins import CreateModelMixin, RetrieveModelMixin, UpdateModelMixin
from system.permissions import HasRoleWorkspacePermission
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



class ReviewAppraisalListAPIView(ListAPIView):
    serializer_class = EmployeeAppraisalSerializer
    permission_classes = [HasRoleWorkspacePermission]
    workspace = 'ReviewAppraisal'
    workspace = 'ReviewAppraisalList'
    
    def get_queryset(self):
        return AppraisalDetails.objects.filter(employee__reporting_manager = self.request.user)
    

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
    serializer_class = EmployeeAppraisalSerializer
    permission_classes = [HasRoleWorkspacePermission]
    workspace = 'AllAppraisal'
    workspace = 'AllAppraisalList'
    

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
    queryset = EmployeeAppraisalStatus.objects.all()
    serializer_class = EmployeeAppraisalStatusSerializer
    permission_classes = [HasRoleWorkspacePermission]
    workspace = 'AllAppraisal'
    sub_workspace = 'AppraisalStatus'