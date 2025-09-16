from django.urls import path
from .views import MyTokenObtainPairView, ChangePasswordView, PasswordResetRequestView, PasswordResetConfirmView
from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenVerifyView,
)

urlpatterns = [
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path("change-password/", ChangePasswordView.as_view(), name="change-password"),
    path("reset-password/", PasswordResetRequestView.as_view(), name="password-reset-request"),
    path("reset-password/<uuid:uid>/<str:token>/", PasswordResetConfirmView.as_view(), name="password-reset-confirm"),
]