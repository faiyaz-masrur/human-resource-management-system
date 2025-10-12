from django.urls import path, include
from .views import (
    MyTokenObtainPairView, 
    ChangePasswordView, 
    PasswordResetRequestView, 
    PasswordResetConfirmView,
    DepartmentViewSet,
    DesignationViewSet,
    GradeViewSet,
    RoleViewSet,
    RolePermissionAPIView,
    ReportingManagerListView,
    BloodGroupViewSet,
    MaritalStatusViewSet,
    EmergencyContactRelationshipViewSet,
    DegreeViewSet,
    SpecializationViewSet,
    BdDistrictViewSet,
    BdThanaViewSet,
)
from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenVerifyView,
)
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'departments', DepartmentViewSet, basename='department')
router.register(r'designations', DesignationViewSet, basename='designation')
router.register(r'grades', GradeViewSet, basename='grade')
router.register(r'roles', RoleViewSet, basename='role')
router.register(r'blood-groups', BloodGroupViewSet, basename='bloodgroup')
router.register(r'marital-statuses', MaritalStatusViewSet, basename='maritalstatus')
router.register(r'emergency-contact-relationships', EmergencyContactRelationshipViewSet, basename='emergencycontactrelationship')
router.register(r'degrees', DegreeViewSet, basename='degree')
router.register(r'specializations', SpecializationViewSet, basename='specialization')
router.register(r'bd-districts', BdDistrictViewSet, basename='bddistrict')
router.register(r'bd-thanas', BdThanaViewSet, basename='bdthana')


urlpatterns = [
    path('', include(router.urls)),
    path("designations/grade/<int:grade_id>/", DesignationViewSet.as_view({"get": "list"})),
    path("bd-thanas/district/<int:district_id>/", BdThanaViewSet.as_view({"get": "list"})),

    path('auth/login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path("auth/change-password/", ChangePasswordView.as_view(), name="change-password"),
    path("auth/reset-password/", PasswordResetRequestView.as_view(), name="password-reset-request"),
    path("auth/reset-password/<uuid:uid>/<str:token>/", PasswordResetConfirmView.as_view(), name="password-reset-confirm"),

    path("reporting-managers/list/", ReportingManagerListView.as_view(), name="reporting-manager-list"),

    path("role-permissions/<int:role>/<str:workspace>/", RolePermissionAPIView.as_view(), name="role-permission-list"),
    path("role-permissions/", RolePermissionAPIView.as_view(), name="role-permission-create"),
    path("role-permissions/<int:pk>/", RolePermissionAPIView.as_view(), name="role-permission-update"),
]