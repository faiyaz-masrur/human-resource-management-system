from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import (
    MyTokenObtainPairSerializer, 
    ChangePasswordSerializer, 
    PasswordResetRequestSerializer, 
    PasswordResetConfirmSerializer, 
    DepartmentSerializer, 
    DesignationSerializer, 
    GradeSerializer, 
    ReportingManagerSerializer
)
from .models import Department, Designation, Grade, ReportingManager
from rest_framework import generics, status, viewsets, views
from .permissions import IsEmployee, IsHR
from rest_framework.response import Response
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.contrib.auth import get_user_model
from django.conf import settings
from .choices import (
    ROLE_CHOICES,
    DISTRICT_CHOICES, 
    POLICE_STATION_CHOICES, 
    DEGREE_CHOICES, 
    SPECIALIZATION_CHOICES,
    MARITAL_STATUS_CHOICES,
    BLOOD_GROUP_CHOICES,
)

User = get_user_model()


class MyTokenObtainPairView(TokenObtainPairView):
    """
    Custom view for token creation to include user data in the response.
    """
    serializer_class = MyTokenObtainPairSerializer


class ChangePasswordView(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    permission_classes = [IsEmployee]

    def get_object(self):
        return self.request.user  

    def update(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if not user.check_password(serializer.validated_data["old_password"]):
            return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(serializer.validated_data["new_password"])
        user.save()
        return Response({"detail": "Password updated successfully."}, status=status.HTTP_200_OK)


class PasswordResetRequestView(generics.GenericAPIView):
    serializer_class = PasswordResetRequestSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]

        try:
            user = User.objects.get(email=email)
            token = default_token_generator.make_token(user)
            reset_url = f"http://yourfrontend.com/reset-password/{user.pk}/{token}/"

            subject = "Password Reset"
            message = f"Hello {user.employee_name},\n\nUse this link to reset your password: {reset_url}",
            from_email = settings.EMAIL_HOST_USER
            recipient_list = [email]
            
            send_mail(subject, message, from_email, recipient_list, fail_silently=True) 
        except User.DoesNotExist:
            pass  # Don't reveal if email exists

        return Response({"detail": "If the email exists, a reset link has been sent."})


class PasswordResetConfirmView(generics.GenericAPIView):
    serializer_class = PasswordResetConfirmSerializer

    def post(self, request, uid, token):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            user = User.objects.get(pk=uid)
        except User.DoesNotExist:
            return Response({"detail": "Invalid link."}, status=status.HTTP_400_BAD_REQUEST)

        if not default_token_generator.check_token(user, token):
            return Response({"detail": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(serializer.validated_data["new_password"])
        user.save()
        return Response({"detail": "Password has been reset successfully."}, status=status.HTTP_200_OK)


class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all().order_by("name")
    serializer_class = DepartmentSerializer
    permission_classes = [IsHR]


class DesignationViewSet(viewsets.ModelViewSet):
    queryset = Designation.objects.all().order_by("name")
    serializer_class = DesignationSerializer
    permission_classes = [IsHR]


class GradeViewSet(viewsets.ModelViewSet):
    queryset = Grade.objects.all().order_by("name")
    serializer_class = GradeSerializer
    permission_classes = [IsHR]


class DepartmentListView(generics.ListAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsHR]



class DesignationListView(generics.ListAPIView):
    serializer_class = DesignationSerializer

    def get_queryset(self):
        grade_id = self.kwargs["grade_id"]  # from URL
        return Designation.objects.filter(grade_id=grade_id)


class GradeListView(generics.ListAPIView):
    queryset = Grade.objects.all()
    serializer_class = GradeSerializer
    permission_classes = [IsHR]


class ReportingManagerListView(generics.ListAPIView):
    queryset = ReportingManager.objects.select_related("manager")
    serializer_class = ReportingManagerSerializer
    permission_classes = [IsHR]


class RoleListView(views.APIView):
    permission_classes = [IsHR]

    def get(self, request):
        return Response({
            "marital_status_choices": [{"key": choice[0], "value": choice[1]} for choice in ROLE_CHOICES],
        })


class PersonalDetailChoicesView(views.APIView):
    permission_classes = [IsEmployee]

    def get(self, request):
        return Response({
            "marital_status_choices": [{"key": choice[0], "value": choice[1]} for choice in MARITAL_STATUS_CHOICES],
            "blood_group_choices": [{"key": choice[0], "value": choice} for key, choice in BLOOD_GROUP_CHOICES],
        })

class AddressChoicesView(views.APIView):
    permission_classes = [IsEmployee]

    def get(self, request):
        return Response({
            "district_choices": [{"key": choice[0], "value": choice[1]} for choice in DISTRICT_CHOICES],
            "police_station_choices": [{"key": choice[0], "value": choice[1]} for choice in POLICE_STATION_CHOICES],
        })
    
class EducationChoicesView(views.APIView):
    permission_classes = [IsEmployee]

    def get(self, request):
        return Response({
            "degree_choices": [{"key": choice[0], "value": choice[1]} for choice in DEGREE_CHOICES],
            "specialization_choices": [{"key": choice[0], "value": choice[1]} for choice in SPECIALIZATION_CHOICES],
        })
    
