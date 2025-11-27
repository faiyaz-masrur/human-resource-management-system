from rest_framework import generics, mixins, viewsets, response
from system.permissions import HasRoleWorkspacePermission
from .models import PersonalDetail, Address, WorkExperience, Education, TrainingCertificate, Attatchment
from system.models import Employee
from .serializers import (
    EmployeeListSerializer,
    EmployeeOfficialDetailSerializer, 
    EmployeePersonalDetailSerializer, 
    AddressSerializer, 
    WorkExperienceSerializer,
    EducationSerializer,
    TrainingCertificateSerializer,
    AttatchmentSerializer,
    AttatchmentUpdateSerializer 
)
from rest_framework.exceptions import ValidationError
from django.shortcuts import get_object_or_404

from django.db.models import Max
from rest_framework.decorators import api_view
from rest_framework.response import Response 





@api_view(['GET'])
def get_next_employee_id(request):
    """Get the next available employee ID based on highest existing numeric ID"""
    try:
        from system.models import Employee  # Import here to avoid circular import
        employees = Employee.objects.all()
        max_id = 0
        
        for emp in employees:
            try:
                emp_id = int(emp.id)
                if emp_id > max_id:
                    max_id = emp_id
            except (ValueError, TypeError):
                continue
        
        # If no employees with numeric IDs exist, return empty string
        if max_id == 0:
            return Response({'next_employee_id': ""})
        
        next_id = str(max_id + 1)
        return Response({'next_employee_id': next_id})
        
    except Exception as e:
        return Response({'error': str(e)}, status=500)

# View for admin to manage employee official details

class EmployeeOfficialDetailViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeOfficialDetailSerializer
    permission_classes = [HasRoleWorkspacePermission]
    workspace = "Employee"
    sub_workspace = "EmployeeOfficialDetail"

   

class EmployeePersonalDetailView(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    generics.GenericAPIView
):
    queryset = PersonalDetail.objects.all()
    serializer_class = EmployeePersonalDetailSerializer
    lookup_field = 'employee'  
    permission_classes = [HasRoleWorkspacePermission]
    workspace = "Employee"
    sub_workspace = "EmployeePersonalDetail"

    def perform_create(self, serializer):
        id = self.kwargs.get("employee")
        employee = get_object_or_404(Employee, pk=id)

        # Check if an address already exists
        if PersonalDetail.objects.filter(employee=employee).exists():
            raise ValidationError("Personal details already exists for this employee.")

        serializer.save(employee=employee)

    def get_object(self):
        employee_id = self.kwargs.get("employee")
        employee = get_object_or_404(Employee, pk=employee_id)

        personal_detail = PersonalDetail.objects.filter(employee=employee).first()

        if not personal_detail:
            personal_detail = PersonalDetail(employee=employee)

        self.request._employee_instance = employee 

        return personal_detail

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return response.Response(serializer.data)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)


class EmployeeAddressView(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    generics.GenericAPIView
):
    serializer_class = AddressSerializer
    permission_classes = [HasRoleWorkspacePermission]
    workspace = "Employee"
    sub_workspace = "EmployeeAddress"
    queryset = Address.objects.all()

    def perform_create(self, serializer):
        id = self.kwargs.get("employee")
        employee = get_object_or_404(Employee, pk=id)

        # Check if an address already exists
        if Address.objects.filter(employee=employee).exists():
            raise ValidationError("Address already exists for this employee.")

        serializer.save(employee=employee)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)
    

class EmployeeWorkExperienceView(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    generics.GenericAPIView
):
    serializer_class = WorkExperienceSerializer
    permission_classes = [HasRoleWorkspacePermission]
    workspace = "Employee"
    sub_workspace = "EmployeeWorkExperience"
    lookup_field = "pk" 

    def get_queryset(self):
        # Get employee id from URL
        id = self.kwargs.get("employee")
        return WorkExperience.objects.filter(employee__id=id)

    def perform_create(self, serializer):
        # Set the employee automatically from URL
        id = self.kwargs.get("employee")
        employee = get_object_or_404(Employee, pk=id)
        serializer.save(employee=employee)

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)
    
    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)


class EmployeeEducationView(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    generics.GenericAPIView
):
    serializer_class = EducationSerializer
    permission_classes = [HasRoleWorkspacePermission]
    workspace = "Employee"
    sub_workspace = "EmployeeEducation"
    lookup_field = "pk" 

    def get_queryset(self):
        # Get employee id from URL
        id = self.kwargs.get("employee")
        return Education.objects.filter(employee__id=id)

    def perform_create(self, serializer):
        # Set the employee automatically from URL
        id = self.kwargs.get("employee")
        employee = get_object_or_404(Employee, pk=id)
        serializer.save(employee=employee)

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)
    
    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)
    

class EmployeeTrainingCertificateView(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    generics.GenericAPIView
):
    serializer_class = TrainingCertificateSerializer
    permission_classes = [HasRoleWorkspacePermission]
    workspace = "Employee"
    sub_workspace = "EmployeeTrainingCertificate"
    lookup_field = "pk" 

    def get_queryset(self):
        # Get employee id from URL
        id = self.kwargs.get("employee")
        return TrainingCertificate.objects.filter(employee__id=id)

    def perform_create(self, serializer):
        # Set the employee automatically from URL
        id = self.kwargs.get("employee")
        employee = get_object_or_404(Employee, pk=id)
        serializer.save(employee=employee)

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)
    
    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)
    
    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)

class EmployeeAttatchmentView(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    generics.GenericAPIView
):
    permission_classes = [HasRoleWorkspacePermission]
    workspace = "Employee"
    sub_workspace = "EmployeeAttachment"
    lookup_field = 'employee'

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return AttatchmentUpdateSerializer
        return AttatchmentSerializer

    def get_object(self):
        employee_id = self.kwargs.get("employee")
        employee = get_object_or_404(Employee, pk=employee_id)
        
        attachment = Attatchment.objects.filter(employee=employee).first()
        
        if not attachment:
            attachment = Attatchment(employee=employee)
            
        return attachment

    def perform_create(self, serializer):
        employee_id = self.kwargs.get("employee")
        employee = get_object_or_404(Employee, pk=employee_id)
        
        # Check if attachment already exists
        if Attatchment.objects.filter(employee=employee).exists():
            raise ValidationError("Attachment already exists for this employee.")
            
        serializer.save(employee=employee)

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)
        



class MyOfficialDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = EmployeeOfficialDetailSerializer
    permission_classes = [HasRoleWorkspacePermission]
    workspace = "MyProfile"
    sub_workspace = "MyOfficialDetail"

    def get_object(self):
        return self.request.user


class MyPersonalDetailView(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    generics.GenericAPIView
):
    serializer_class = EmployeePersonalDetailSerializer
    permission_classes = [HasRoleWorkspacePermission]
    workspace = "MyProfile"
    sub_workspace = "MyPersonalDetail"

    def perform_create(self, serializer):
        employee = self.request.user

        if PersonalDetail.objects.filter(employee=employee).exists():
            raise ValidationError("Personal details already exists for this employee.")

        serializer.save(employee=employee)

    def get_object(self):
        employee = self.request.user

        personal_detail = PersonalDetail.objects.filter(employee=employee).first()

        if not personal_detail:
            personal_detail = PersonalDetail(employee=employee)

        self.request._employee_instance = employee  

        return personal_detail
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return response.Response(serializer.data)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)
    

class MyAddressView(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    generics.GenericAPIView
):
    serializer_class = AddressSerializer
    permission_classes = [HasRoleWorkspacePermission]
    workspace = "MyProfile"
    sub_workspace = "MyAddress"


    def get_object(self):
        return get_object_or_404(Address, employee=self.request.user)

    def perform_create(self, serializer):
        if Address.objects.filter(employee=self.request.user).exists():
            raise ValidationError("Address already exists. Use PUT to update.")
        serializer.save(employee=self.request.user)

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)


class MyWorkExperienceView(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    generics.GenericAPIView
):
    serializer_class = WorkExperienceSerializer
    permission_classes = [HasRoleWorkspacePermission]
    workspace = "MyProfile"
    sub_workspace = "MyWorkExperience"
    lookup_field = "pk" 

    def get_queryset(self):
        return WorkExperience.objects.filter(employee=self.request.user)

    def perform_create(self, serializer):
        serializer.save(employee=self.request.user)

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)
    
    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)
    

class MyEducationeView(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    generics.GenericAPIView
):
    serializer_class = EducationSerializer
    permission_classes = [HasRoleWorkspacePermission]
    workspace = "MyProfile"
    sub_workspace = "MyEducation"
    lookup_field = "pk" 

    def get_queryset(self):
        return Education.objects.filter(employee=self.request.user)

    def perform_create(self, serializer):
        serializer.save(employee=self.request.user)

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)
    
    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)
    

class MyTrainingCertificateView(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    generics.GenericAPIView
):
    serializer_class = TrainingCertificateSerializer
    permission_classes = [HasRoleWorkspacePermission]
    workspace = "MyProfile"
    sub_workspace = "MyTrainingCertificate"
    lookup_field = "pk" 

    def get_queryset(self):
        return TrainingCertificate.objects.filter(employee=self.request.user)

    def perform_create(self, serializer):
        serializer.save(employee=self.request.user)

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)
    
    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)
    
    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)


class MyAttatchmentView(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    generics.GenericAPIView
):
    permission_classes = [HasRoleWorkspacePermission]
    workspace = "MyProfile"
    sub_workspace = "MyAttachment"

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return AttatchmentUpdateSerializer
        return AttatchmentSerializer

    def get_object(self):
        attachment = Attatchment.objects.filter(employee=self.request.user).first()
        
        if not attachment:
            attachment = Attatchment(employee=self.request.user)
            
        return attachment

    def perform_create(self, serializer):
        if Attatchment.objects.filter(employee=self.request.user).exists():
            raise ValidationError("Attachment already exists. Use PUT to update.")
            
        serializer.save(employee=self.request.user)

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)


class EmployeeListView(generics.ListAPIView):
    queryset = Employee.objects.all().order_by("name")
    serializer_class = EmployeeListSerializer
    permission_classes = [HasRoleWorkspacePermission]
    workspace = "Employee"
    sub_workspace = "EmployeeList"