from django.urls import path, include
from .views import (
    MyTokenObtainPairView, 
    ChangePasswordView, 
    PasswordResetRequestView, 
    PasswordResetConfirmView,
    DepartmentViewSet,
    DesignationViewSet,
    GradeViewSet,
    DepartmentListView,
    DesignationListView,
    GradeListView,
    RoleListView,
    ReportingManagerListView,
    PersonalDetailChoicesView,
    AddressChoicesView,
    EducationChoicesView,
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

urlpatterns = [
    path('', include(router.urls)),
    path('auth/login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path("auth/change-password/", ChangePasswordView.as_view(), name="change-password"),
    path("auth/reset-password/", PasswordResetRequestView.as_view(), name="password-reset-request"),
    path("auth/reset-password/<uuid:uid>/<str:token>/", PasswordResetConfirmView.as_view(), name="password-reset-confirm"),

    path("departments/list/", DepartmentListView.as_view(), name="department-list"),
    path("designations/list/<int:grade_id>", DesignationListView.as_view(), name="designation-list"),
    path("grades/list/", GradeListView.as_view(), name="grade-list"),
    path("roles/list/", RoleListView.as_view(), name="role-list"),
    path("reporting-managers/list/", ReportingManagerListView.as_view(), name="reporting-manager-list"),
    path("personal-detail/choices/", PersonalDetailChoicesView.as_view(), name="personal-detail-choices"),
    path("address/choices/", AddressChoicesView.as_view(), name="address-choices"),
    path("education/choices/", EducationChoicesView.as_view(), name="education-choices"),
]