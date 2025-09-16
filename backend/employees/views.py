from rest_framework.generics import RetrieveUpdateAPIView
from system.permissions import IsEmployee
from .models import Employee
from .serializers import EmployeeSerializer

class EmployeeRetrieveUpdateView(RetrieveUpdateAPIView):
    serializer_class = EmployeeSerializer
    permission_classes = [IsEmployee]

    def get_object(self):
        # request.user is already an Employee (since Employee extends User)
        return Employee.objects.get(id=self.request.user.id)
