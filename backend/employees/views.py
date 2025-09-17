from rest_framework import generics
from system.permissions import IsEmployee, IsAdmin
from .models import Employee
from .serializers import EmployeeRetrieveUpdateSerializer, EmployeeListSerializer, EmployeeCreateRetriveUpdateDeleteSerializer
from rest_framework import viewsets


class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all().order_by("employee_name")
    permission_classes = [IsAdmin]
    
    def get_serializer_class(self):
        if self.action in ['list']:
            return EmployeeListSerializer
        return EmployeeCreateRetriveUpdateDeleteSerializer
    
class EmployeeRetrieveUpdateView(generics.RetrieveUpdateAPIView):
    """
    API view for an employee to retrieve and update their own profile.
    Employees can only update:
    - Education
    - Work experience
    - Professional certificates
    - Signature
    - Image
    """
    serializer_class = EmployeeRetrieveUpdateSerializer
    permission_classes = [IsEmployee]

    def get_object(self):
        """
        Return the currently logged-in employee.
        """
        return self.request.user.employee_profile

    def update(self, request, *args, **kwargs):
        """
        Override update to allow partial updates.
        """
        partial = kwargs.pop('partial', True)
        return super().update(request, *args, **kwargs)
