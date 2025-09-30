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
router.register(r'roles', RoleViewSet, basename='role')

urlpatterns = [
    path('', include(router.urls)),
    path("designations/grade/<int:grade_id>/", DesignationViewSet.as_view({"get": "list"})),
    path('auth/login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path("auth/change-password/", ChangePasswordView.as_view(), name="change-password"),
    path("auth/reset-password/", PasswordResetRequestView.as_view(), name="password-reset-request"),
    path("auth/reset-password/<uuid:uid>/<str:token>/", PasswordResetConfirmView.as_view(), name="password-reset-confirm"),

    path("reporting-managers/list/", ReportingManagerListView.as_view(), name="reporting-manager-list"),
    path("personal-detail/choices/", PersonalDetailChoicesView.as_view(), name="personal-detail-choices"),
    path("address/choices/", AddressChoicesView.as_view(), name="address-choices"),
    path("education/choices/", EducationChoicesView.as_view(), name="education-choices"),
]