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
router.register(r'departments', DepartmentViewSet, basename='departments')
router.register(r'designations', DesignationViewSet, basename='designations')
router.register(r'grades', GradeViewSet, basename='grades')
router.register(r'roles', RoleViewSet, basename='roles')
router.register(r'blood-groups', BloodGroupViewSet, basename='bloodgroup')
router.register(r'marital-statuses', MaritalStatusViewSet, basename='maritalstatus')
router.register(r'emergency-contact-relationships', EmergencyContactRelationshipViewSet, basename='emergencycontactrelationship')
router.register(r'degrees', DegreeViewSet, basename='degree')
router.register(r'specializations', SpecializationViewSet, basename='specialization')
router.register(r'bd-districts', BdDistrictViewSet, basename='bddistrict')
router.register(r'bd-thanas', BdThanaViewSet, basename='bdthana')


urlpatterns = [
    # 1. CHANGE HERE: Wrap the router inclusion with 'configurations/'
    path('configurations/', include(router.urls)),
    
    # 2. Update the custom designation/grade path to also be under configurations/ 
    # as it relates directly to the designations resource.
    path("configurations/designations/grade/<int:grade_id>/", DesignationViewSet.as_view({"get": "list"})),
    
    # 3. BdThana paths are geographical configurations, so include them under configurations/ too
    path("configurations/bd-thanas/district/<int:district_id>/", BdThanaViewSet.as_view({"get": "list"})),

    # 4. AUTH paths remain directly under 'api/system/'
    path('auth/login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path("auth/change-password/", ChangePasswordView.as_view(), name="change-password"),
    path("auth/reset-password/", PasswordResetRequestView.as_view(), name="password-reset-request"),
    path("auth/reset-password/<uuid:uid>/<str:token>/", PasswordResetConfirmView.as_view(), name="password-reset-confirm"),

    # 5. Other custom system paths remain directly under 'api/system/'
    path("reporting-managers/list/", ReportingManagerListView.as_view(), name="reporting-manager-list"),

    # 6. Role Permissions paths can remain under 'api/system/' or you might want to move them too.
    # Keeping them separate from the general configuration ViewSets for now, as they are custom endpoints.
    path("role-permissions/<str:workspace>/", RolePermissionAPIView.as_view(), name="role-permission-list"),
    path("role-permissions/<str:workspace>/<str:sub_workspace>/", RolePermissionAPIView.as_view(), name="role-permission-list"),
    path("role-permissions/", RolePermissionAPIView.as_view(), name="role-permission-create"),
    path("role-permissions/<int:pk>/", RolePermissionAPIView.as_view(), name="role-permission-update"),
]