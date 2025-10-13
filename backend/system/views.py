from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import (
    MyTokenObtainPairSerializer, 
    ChangePasswordSerializer, 
    PasswordResetRequestSerializer, 
    PasswordResetConfirmSerializer, 
    DepartmentSerializer, 
    DesignationSerializer, 
    GradeSerializer, 
    ReportingManagerSerializer,
    RoleSerializer,
    RolePermissionSerializer,
    BloodGroupSerializer,
    MaritalStatusSerializer,
    EmergencyContactRelationshipSerializer,
    DegreeSerializer,
    SpecializationSerializer,
    BdDistrictSerializer,
    BdThanaSerializer
)
from .models import (
    Department, 
    Designation, 
    Grade, 
    ReportingManager, 
    Role,
    RolePermission,
    BloodGroup,
    MaritalStatus,
    EmergencyContactRelationship,
    Degree,
    Specialization,
    BdDistrict,
    BdThana
)
from rest_framework import generics, status, viewsets, views
from .permissions import HasRoleWorkspacePermission
from rest_framework import mixins
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.contrib.auth import get_user_model
from django.conf import settings

User = get_user_model()


class MyTokenObtainPairView(TokenObtainPairView):
    """
    Custom view for token creation to include user data in the response.
    """
    serializer_class = MyTokenObtainPairSerializer


class ChangePasswordView(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    permission_classes = [IsAuthenticated]

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
            message = f"Hello {user.name},\n\nUse this link to reset your password: {reset_url}",
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
    permission_classes = [HasRoleWorkspacePermission]
    workspace = "Configurations"
    sub_workspace = "Department"


class GradeViewSet(viewsets.ModelViewSet):
    queryset = Grade.objects.all().order_by("name")
    serializer_class = GradeSerializer
    permission_classes = [HasRoleWorkspacePermission]
    workspace = "Configurations"
    sub_workspace = "Grade"


class DesignationViewSet(viewsets.ModelViewSet):
    serializer_class = DesignationSerializer
    permission_classes = [HasRoleWorkspacePermission]
    workspace = "Configurations"
    sub_workspace = "Designation"

    def get_queryset(self):
        grade_id = self.kwargs.get("grade_id") 
        if grade_id:
            return Designation.objects.filter(grade_id=grade_id).order_by("name")
        return Designation.objects.all().order_by("name")
    


class RoleViewSet(viewsets.ModelViewSet):
    queryset = Role.objects.all().order_by("name")
    serializer_class = RoleSerializer
    permission_classes = [HasRoleWorkspacePermission]
    workspace = "Configurations"
    sub_workspace = "Role"


class RolePermissionAPIView(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    mixins.RetrieveModelMixin,
    generics.GenericAPIView
):
    serializer_class = RolePermissionSerializer
    queryset = RolePermission.objects.all()
    permission_classes = [HasRoleWorkspacePermission]
    workspace = "Configuration"
    sub_workspace = "Role"

    def get_permissions(self):
        if self.kwargs.get("workspace") and self.kwargs.get("sub_workspace"):
            return [IsAuthenticated()]
        return [permission() for permission in self.permission_classes]

    def get_queryset(self):
        queryset = super().get_queryset()
        role = self.request.user.role
        workspace = self.kwargs.get("workspace")
        sub_workspace = self.kwargs.get("sub_workspace")

        if role and workspace and sub_workspace:
            queryset = queryset.filter(role=role, workspace=workspace, sub_workspace=sub_workspace)
        elif role and workspace:
            queryset = queryset.filter(role=role, workspace=workspace)
        return queryset

    def get(self, request, *args, **kwargs):
        if self.kwargs.get("sub_workspace"):
            return self.retrieve(request, *args, **kwargs)
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)



class ReportingManagerListView(generics.ListAPIView):
    queryset = ReportingManager.objects.select_related("manager")
    serializer_class = ReportingManagerSerializer
    permission_classes = [IsAuthenticated]


class BloodGroupViewSet(viewsets.ModelViewSet):
    queryset = BloodGroup.objects.all().order_by("name")
    serializer_class = BloodGroupSerializer
    permission_classes = [IsAuthenticated]

    

class MaritalStatusViewSet(viewsets.ModelViewSet):
    queryset = MaritalStatus.objects.all().order_by("name")
    serializer_class = MaritalStatusSerializer
    permission_classes = [IsAuthenticated]
    

class EmergencyContactRelationshipViewSet(viewsets.ModelViewSet):
    queryset = EmergencyContactRelationship.objects.all().order_by("name")
    serializer_class = EmergencyContactRelationshipSerializer
    permission_classes = [IsAuthenticated]
    

class DegreeViewSet(viewsets.ModelViewSet):
    queryset = Degree.objects.all().order_by("name")
    serializer_class = DegreeSerializer
    permission_classes = [IsAuthenticated]
    

class SpecializationViewSet(viewsets.ModelViewSet):
    queryset = Specialization.objects.all().order_by("name")
    serializer_class = SpecializationSerializer
    permission_classes = [IsAuthenticated]
    

class BdDistrictViewSet(viewsets.ModelViewSet):
    queryset = BdDistrict.objects.all().order_by("name")
    serializer_class = BdDistrictSerializer
    permission_classes = [IsAuthenticated]
    

class BdThanaViewSet(viewsets.ModelViewSet):
    serializer_class = BdThanaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        district_id = self.kwargs.get("district_id") # from URL
        if district_id:
            return BdThana.objects.filter(district_id=district_id).order_by("name")
        return BdThana.objects.all().order_by("name")

    



    
