from django.urls import path, include
from .views import (
    UserDataApiView, 
    ChangePasswordView, 
    PasswordResetRequestView, 
    PasswordResetConfirmView,
    DepartmentViewSet,
    DesignationViewSet,
    GradeViewSet,
    RoleViewSet,
    RolePermissionAPIView,
    ReportingManagerListView,
    BloodGroupListView,
    MaritalStatusListView,
    EmergencyContactRelationshipListView,
    DegreeListView,
    SpecializationListView,
    BdDistrictListView,
    BdThanaListView,
    TrainingTypeListView,
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'departments', DepartmentViewSet, basename='departments')
router.register(r'designations', DesignationViewSet, basename='designations')
router.register(r'grades', GradeViewSet, basename='grades')
router.register(r'roles', RoleViewSet, basename='roles')


urlpatterns = [
    # 1. CHANGE HERE: Wrap the router inclusion with 'configurations/'
    path('configurations/', include(router.urls)),
    

    path("configurations/grade-specific-designations/<int:grade_id>/", DesignationViewSet.as_view({"get": "list"})),

    # 4. AUTH paths remain directly under 'api/system/'
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path("auth/change-password/", ChangePasswordView.as_view(), name="change-password"),
    path("auth/reset-password/", PasswordResetRequestView.as_view(), name="password-reset-request"),
    #path("auth/reset-password/<uuid:uid>/<str:token>/", PasswordResetConfirmView.as_view(), name="password-reset-confirm"),
    path("auth/reset-password/<str:uid>/<str:token>/", PasswordResetConfirmView.as_view(), name="password-reset-confirm"),

    path("auth/get-user-data/", UserDataApiView.as_view(), name="get-user-data"),

    # 5. Other custom system paths remain directly under 'api/system/'
    path("configurations/reporting-managers-list/", ReportingManagerListView.as_view(), name="reporting-manager-list"),
    path("configurations/blood-group-list/", BloodGroupListView.as_view(), name="blood-group-list"),
    path("configurations/marital-status-list/", MaritalStatusListView.as_view(), name="marital-status-list"),
    path("configurations/emergency-contact-relationship-list/", EmergencyContactRelationshipListView.as_view(), name="emergency-contact-relationship-list"),
    path("configurations/degree-list/", DegreeListView.as_view(), name="degree-list"),
    path("configurations/specialization-list/", SpecializationListView.as_view(), name="specialization-list"),
    path("configurations/training-type-list/", TrainingTypeListView.as_view(), name="training-type-list"),
    path("configurations/bd-district-list/", BdDistrictListView.as_view(), name="bd-district-list"),
    path("configurations/bd-thana-list/", BdThanaListView.as_view(), name="bd-thana-list"),
    path("configurations/bd-thana-list/<int:district_id>/", BdThanaListView.as_view(), name="bd-thana-list-district"),

    # 6. Role Permissions paths can remain under 'api/system/' or you might want to move them too.
    # Keeping them separate from the general configuration ViewSets for now, as they are custom endpoints.
    path("role-permissions/<int:role>/", RolePermissionAPIView.as_view(), name="role-permission-list"),
    path("role-permissions/<int:role>/<str:workspace>/", RolePermissionAPIView.as_view(), name="role-permission-list"),
    path("role-permissions/<int:role>/<str:workspace>/<str:sub_workspace>/", RolePermissionAPIView.as_view(), name="role-permission-list"),
    path("role-permissions/", RolePermissionAPIView.as_view(), name="role-permission-create"),
    path("role-permissions/<int:pk>/", RolePermissionAPIView.as_view(), name="role-permission-update"),
]