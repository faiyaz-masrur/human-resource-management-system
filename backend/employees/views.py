from rest_framework import generics
from system.permissions import IsEmployee
from .models import Employee
from .serializers import EmployeeProfileSerializer


class EmployeeProfileView(generics.RetrieveUpdateAPIView):
    """
    API view for an employee to retrieve and update their own profile.
    Employees can only update:
    - Education
    - Work experience
    - Professional certificates
    - Signature
    - Image
    """
    serializer_class = EmployeeProfileSerializer
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
