from django.shortcuts import render

# Create your views here.
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Employee
from .serializers import EmployeeProfileSerializer
from .permissions import IsOwner


class EmployeeProfileView(generics.RetrieveUpdateAPIView):
    """
    API view for an employee to retrieve and update their own profile.
    Only the authenticated user can access their own profile.
    """
    queryset = Employee.objects.all()
    serializer_class = EmployeeProfileSerializer
    permission_classes = [IsOwner]
    
    def get_object(self):
        """
        Overridden to ensure the request object is the currently authenticated employee.
        """
        return self.request.user.employee_profile
