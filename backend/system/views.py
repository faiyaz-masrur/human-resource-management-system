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
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.contrib.auth import get_user_model
from django.conf import settings

from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str

from rest_framework.permissions import AllowAny  
User = get_user_model()


class MyTokenObtainPairView(TokenObtainPairView):
    """
    Custom view for token creation to include user data in the response.
    """
    serializer_class = MyTokenObtainPairSerializer
    permission_classes = [AllowAny]


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
    permission_classes = [AllowAny] 

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]
        
        print(f"🔍 Password reset requested for: {email}")

        try:
            user = User.objects.get(email=email)
            print(f"✅ User found: {user.email}")
            
            token = default_token_generator.make_token(user)
            
            # FIX: Use base64 encoding for user ID
            uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
            
            reset_url = f"http://localhost:5173/forget-password-update?uid={uidb64}&token={token}"

            subject = "Password Reset Request - Sonali Intellect HRMS"
            message = f"""
Hello {user.email},

You have requested to reset your password for the Sonali Intellect HRMS.

Please click the link below to reset your password:
{reset_url}

If you did not request this reset, please ignore this email.

Best regards,
Sonali Intellect Limited
            """
            
            print(f"📧 Reset URL: {reset_url}")
            
            # Send email
            send_mail(
                subject, 
                message, 
                settings.DEFAULT_FROM_EMAIL, 
                [email], 
                fail_silently=False
            )
            
            print(f"✅ Email sent successfully to: {email}")
            
        except User.DoesNotExist:
            print(f"❌ User not found with email: {email}")
            pass

        return Response({"detail": "If the email exists, a reset link has been sent."})


class PasswordResetConfirmView(generics.GenericAPIView):
    serializer_class = PasswordResetConfirmSerializer
    permission_classes = [AllowAny]  

    def post(self, request, uid, token):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            # FIX: Decode the base64 user ID back to integer
            uid_decoded = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=uid_decoded)
            print(f"✅ Password reset for user: {user.email}")
        except (User.DoesNotExist, ValueError, TypeError, OverflowError):
            print(f"❌ Invalid reset link - uid: {uid}")
            return Response({"detail": "Invalid link."}, status=status.HTTP_400_BAD_REQUEST)

        if not default_token_generator.check_token(user, token):
            print(f"❌ Invalid token for user: {user.email}")
            return Response({"detail": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(serializer.validated_data["new_password"])
        user.save()
        print(f"✅ Password reset successful for: {user.email}")
        return Response({"detail": "Password has been reset successfully."}, status=status.HTTP_200_OK)

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all().order_by("name")
    serializer_class = DepartmentSerializer
    permission_classes = [HasRoleWorkspacePermission]
    workspace = "Configuration"
    sub_workspace = "Department"

    def get_permissions(self):
        if self.action == "list":
            return [IsAuthenticated()]
        return [permission() for permission in self.permission_classes]


class GradeViewSet(viewsets.ModelViewSet):
    queryset = Grade.objects.all().order_by("name")
    serializer_class = GradeSerializer
    permission_classes = [HasRoleWorkspacePermission]
    workspace = "Configuration"
    sub_workspace = "Grade"

    def get_permissions(self):
        if self.action == "list":
            return [IsAuthenticated()]
        return [permission() for permission in self.permission_classes]


class DesignationViewSet(viewsets.ModelViewSet):
    serializer_class = DesignationSerializer
    permission_classes = [HasRoleWorkspacePermission]
    workspace = "Configuration"
    sub_workspace = "Designation"

    def get_permissions(self):
        if self.action == "list":
            return [IsAuthenticated()]
        return [permission() for permission in self.permission_classes]

    def get_queryset(self):
        grade_id = self.kwargs.get("grade_id") 
        if grade_id:
            return Designation.objects.filter(grade_id=grade_id).order_by("name")
        return Designation.objects.all().order_by("name")
    


class RoleViewSet(viewsets.ModelViewSet):
    queryset = Role.objects.all().order_by("name")
    serializer_class = RoleSerializer
    permission_classes = [HasRoleWorkspacePermission]
    workspace = "Configuration"
    sub_workspace = "Role"

    def get_permissions(self):
        if self.action == "list":
            return [IsAuthenticated()]
        return [permission() for permission in self.permission_classes]


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
        role = self.kwargs.get("role")
        workspace = self.kwargs.get("workspace")
        sub_workspace = self.kwargs.get("sub_workspace")

        if role and workspace and sub_workspace:
            queryset = queryset.filter(role=role, workspace=workspace, sub_workspace=sub_workspace)
        elif role and workspace:
            queryset = queryset.filter(role=role, workspace=workspace)
        elif role:
            queryset = queryset.filter(role=role)
        return queryset

    def get(self, request, *args, **kwargs):
        role = self.kwargs.get("role")
        workspace = self.kwargs.get("workspace")
        sub_workspace = self.kwargs.get("sub_workspace")

        if role and workspace and sub_workspace:
            instance = self.get_queryset().first()
            if not instance:
                return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
            serializer = self.get_serializer(instance)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)



class ReportingManagerListView(generics.ListAPIView):
    queryset = ReportingManager.objects.select_related("manager")
    serializer_class = ReportingManagerSerializer
    permission_classes = [IsAuthenticated]


class BloodGroupListView(generics.ListAPIView):
    queryset = BloodGroup.objects.all().order_by("name")
    serializer_class = BloodGroupSerializer
    permission_classes = [IsAuthenticated]

    

class MaritalStatusListView(generics.ListAPIView):
    queryset = MaritalStatus.objects.all().order_by("name")
    serializer_class = MaritalStatusSerializer
    permission_classes = [IsAuthenticated]
    

class EmergencyContactRelationshipListView(generics.ListAPIView):
    queryset = EmergencyContactRelationship.objects.all().order_by("name")
    serializer_class = EmergencyContactRelationshipSerializer
    permission_classes = [IsAuthenticated]
    

class DegreeListView(generics.ListAPIView):
    queryset = Degree.objects.all().order_by("name")
    serializer_class = DegreeSerializer
    permission_classes = [IsAuthenticated]
    

class SpecializationListView(generics.ListAPIView):
    queryset = Specialization.objects.all().order_by("name")
    serializer_class = SpecializationSerializer
    permission_classes = [IsAuthenticated]
    

class BdDistrictListView(generics.ListAPIView):
    queryset = BdDistrict.objects.all().order_by("name")
    serializer_class = BdDistrictSerializer
    permission_classes = [IsAuthenticated]
    

class BdThanaListView(generics.ListAPIView):
    serializer_class = BdThanaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        district_id = self.kwargs.get("district_id") # from URL
        if district_id:
            return BdThana.objects.filter(district_id=district_id).order_by("name")
        return BdThana.objects.all().order_by("name")

    



    
