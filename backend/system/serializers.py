from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import password_validation
from .models import (
    Employee, 
    Department, 
    Designation, 
    Grade, 
    Role, 
    RolePermission,
    ReportingManager,
    BloodGroup,
    MaritalStatus,
    EmergencyContactRelationship,
    Degree,
    Specialization,
    BdDistrict,
    BdThana,
    TrainingType,
)
from .choices import WORKSPACE_SUBWORKSPACE_MAP

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['id', 'email', 'name', 'role']
    

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    confirm_password = serializers.CharField(required=True)

    def validate_new_password(self, value):
        password_validation.validate_password(value)
        return value

    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        return attrs

class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

class PasswordResetConfirmSerializer(serializers.Serializer):
    new_password = serializers.CharField(required=True)
    confirm_password = serializers.CharField(required=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        return attrs
    
class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = "__all__"

class DesignationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Designation
        fields = "__all__"

class GradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grade
        fields = "__all__"


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = "__all__"

class RolePermissionSerializer(serializers.ModelSerializer):
    role_name = serializers.CharField(source="role.name", read_only=True)

    class Meta:
        model = RolePermission  # Accessing the through model
        fields = ["id", "role_name", "role", "workspace", "sub_workspace", "view", "create", "edit", "delete", "download"]

class ReportingManagerSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="manager.name", read_only=True)

    class Meta:
        model = ReportingManager
        fields = ["manager", "name"]

class BloodGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = BloodGroup
        fields = "__all__"

class MaritalStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaritalStatus
        fields = "__all__"

class EmergencyContactRelationshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmergencyContactRelationship
        fields = "__all__"

class DegreeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Degree
        fields = "__all__"

class SpecializationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Specialization
        fields = "__all__"

class BdDistrictSerializer(serializers.ModelSerializer):
    class Meta:
        model = BdDistrict
        fields = "__all__"

class BdThanaSerializer(serializers.ModelSerializer):
    class Meta:
        model = BdThana
        fields = "__all__"  

class TrainingTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainingType
        fields = "__all__"
