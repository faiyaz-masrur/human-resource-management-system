from rest_framework import generics, mixins, viewsets
from system.permissions import IsEmployee, IsAdmin
from .models import PersonalDetail, Address, WorkExperience, Education, ProfessionalCertificate, Attatchment
from system.models import Employee
from .serializers import (
    EmployeeOfficialDetailSerializer, 
    EmployeePersonalDetailSerializer, 
    AddressSerializer, 
    MyOfficialDetailSerializer,
    WorkExperienceSerializer,
    EducationSerializer,
    ProfessionalCertificateSerializer,
    AttatchmentSerializer
)
from rest_framework.exceptions import ValidationError
from django.shortcuts import get_object_or_404


# View for admin to manage employee official details

class EmployeeOfficialDetailViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeOfficialDetailSerializer
    permission_classes = [IsAdmin]


class EmployeePersonalDetailView(generics.RetrieveUpdateAPIView):
    queryset = PersonalDetail.objects.all()
    serializer_class = EmployeePersonalDetailSerializer
    lookup_field = 'employee'  
    permission_classes = [IsAdmin]


class EmployeeAddressView(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    generics.GenericAPIView
):
    serializer_class = AddressSerializer
    permission_classes = [IsAdmin]
    lookup_field = "employee"  # Matches the URL param <employee>
    queryset = Address.objects.all()

    def perform_create(self, serializer):
        """
        Create address only if it doesn't exist for this employee.
        """
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
    permission_classes = [IsAdmin]
    lookup_field = "work_experience" 

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
    permission_classes = [IsAdmin]
    lookup_field = "education" 

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
    

class EmployeeProfessionalCertificateView(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    generics.GenericAPIView
):
    serializer_class = ProfessionalCertificateSerializer
    permission_classes = [IsAdmin]
    lookup_field = "professional_certificate" 

    def get_queryset(self):
        # Get employee id from URL
        id = self.kwargs.get("employee")
        return ProfessionalCertificate.objects.filter(employee__id=id)

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
    

class EmployeeAttatchmentView(generics.RetrieveUpdateAPIView):
    queryset = Attatchment.objects.all()
    serializer_class = AttatchmentSerializer
    lookup_field = 'employee'  
    permission_classes = [IsAdmin]
        

#View for employees to get, update their own details

class MyOfficialDetailView(generics.RetrieveAPIView):
    serializer_class = MyOfficialDetailSerializer
    permission_classes = [IsEmployee]

    def get_object(self):
        return self.request.user


class MyPersonalDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = EmployeePersonalDetailSerializer
    permission_classes = [IsEmployee]

    def get_object(self):
        return get_object_or_404(PersonalDetail, employee=self.request.user)
    

class MyAddressView(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    generics.GenericAPIView
):
    serializer_class = AddressSerializer
    permission_classes = [IsEmployee]


    def get_object(self):
        return get_object_or_404(Address, employee=self.request.user)

    def perform_create(self, serializer):
        # Create only if it doesn't exist
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
    permission_classes = [IsEmployee]
    lookup_field = "work_experience" 

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
    permission_classes = [IsEmployee]
    lookup_field = "education" 

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
    

class MyProfessionalCertificateView(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    generics.GenericAPIView
):
    serializer_class = ProfessionalCertificateSerializer
    permission_classes = [IsEmployee]
    lookup_field = "professional_certificate" 

    def get_queryset(self):
        return ProfessionalCertificate.objects.filter(employee=self.request.user)

    def perform_create(self, serializer):
        serializer.save(employee=self.request.user)

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)
    
    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)


class MyAttatchmentView(generics.RetrieveUpdateAPIView):
    serializer_class = AttatchmentSerializer
    permission_classes = [IsEmployee]

    def get_object(self):
        return get_object_or_404(Attatchment, employee=self.request.user)
