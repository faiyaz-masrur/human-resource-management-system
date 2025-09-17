from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EmployeeRetrieveUpdateView, EmployeeViewSet

router = DefaultRouter()
router.register(r'info', EmployeeViewSet, basename='employee')


urlpatterns = [
    # CRUD endpoints for Employee model by admin users
    path('', include(router.urls)),
    # URL for an employee to view and edit their own profile
    path('profile/', EmployeeRetrieveUpdateView.as_view(), name='employee_profile'),
]
