from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (EmployeeOfficialDetailViewSet, 
                    EmployeePersonalDetailView, 
                    EmployeeAddressView,
                    EmployeeWorkExperienceView,
                    MyOfficialDetailView, 
                    MyPersonalDetailView,
                    MyAddressView,
                    MyWorkExperienceView,
                    EmployeeEducationView,
                    MyEducationeView,
                    EmployeeProfessionalCertificateView,
                    MyProfessionalCertificateView,
                    EmployeeAttatchmentView,
                    MyAttatchmentView,
                    EmployeeListView
)

router = DefaultRouter()
router.register(r'empolyee-official-details', EmployeeOfficialDetailViewSet, basename='employee_official_detail')


urlpatterns = [
    # endpoints for hr to view, create, update, delete Employee model
    path('', include(router.urls)),
    path('employee-personal-details/<str:employee>/', EmployeePersonalDetailView.as_view(), name='employee-personal-detail'),
    path('employee-address/<str:employee>/', EmployeeAddressView.as_view(), name='employee-address'),
    path('employee-work-experience/<str:employee>/', EmployeeWorkExperienceView.as_view(), name='employee-work-experience-all'),
    path('employee-work-experience/<str:employee>/<int:work_experience>/', EmployeeWorkExperienceView.as_view(), name='employee-work-experience'),
    path('employee-education/<str:employee>/', EmployeeEducationView.as_view(), name='employee-education-all'),
    path('employee-education/<str:employee>/<int:education>/', EmployeeEducationView.as_view(), name='employee-education'),
    path('employee-professional-certificate/<str:employee>/', EmployeeProfessionalCertificateView.as_view(), name='employee-professional-certificate-all'),
    path('employee-professional-certificate/<str:employee>/<int:professional_certificate>/', EmployeeProfessionalCertificateView.as_view(), name='employee-professional-certificate'),
    path('employee-attatchment/<str:employee>/', EmployeeAttatchmentView.as_view(), name='employee-attatchment'),

    # endpoints for employees to view and update their own details
    path('my-official-details/', MyOfficialDetailView.as_view(), name='my-official-detail'),
    path('my-personal-details/', MyPersonalDetailView.as_view(), name='my-personal-detail'),
    path("my-address/", MyAddressView.as_view(), name="my-address"),
    path("my-work-experience/", MyWorkExperienceView.as_view(), name="my-work-experience-all"),
    path("my-work-experience/<int:work_experience>/", MyWorkExperienceView.as_view(), name="my-work-experience"),
    path("my-education/", MyEducationeView.as_view(), name="my-education-all"),
    path("my-education/<int:education>/", MyEducationeView.as_view(), name="my-education"),
    path('my-professional-certificate/', MyProfessionalCertificateView.as_view(), name='my-professional-certificate-all'),
    path('my-professional-certificate/<int:professional_certificate>/', MyProfessionalCertificateView.as_view(), name='my-professional-certificate'),
    path("my-attatchment/", MyAttatchmentView.as_view(), name="my-attatchment"),

    path('employee-list/', EmployeeListView.as_view(), name='employee-list'),
]
