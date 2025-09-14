from rest_framework.permissions import BasePermission
from django.shortcuts import get_object_or_404
from .models import EmployeeAppraisal

class IsReportingManager(BasePermission):
    """
    Custom permission to only allow reporting managers of an employee to access a review.
    """
    def has_permission(self, request, view):
        # We need the appraisal ID from the URL to check permissions.
        # This will be available in the `view.kwargs` dictionary.
        appraisal_id = view.kwargs.get('appraisal_id')
        if not appraisal_id:
            # If there's no appraisal ID, the user doesn't have permission.
            return False
            
        try:
            appraisal = get_object_or_404(EmployeeAppraisal, pk=appraisal_id)
            # The user must be the reporting manager for the employee associated with the appraisal.
            return appraisal.employee.reporting_manager == request.user.employee_profile
        except EmployeeAppraisal.DoesNotExist:
            return False

class IsHR(BasePermission):
    """
    Custom permission to only allow HR users to access HR review endpoints.
    """
    def has_permission(self, request, view):
        # This checks if the authenticated user has an 'is_hr_manager' attribute set to True.
        # You'll need to implement this field on your User or Employee model.
        return request.user.is_hr_manager

class IsFinalReviewer(BasePermission):
    """
    Custom permission to only allow HOD, COO, or CEO users to access the final review.
    """
    def has_permission(self, request, view):
        user = request.user
        # This checks for specific roles.
        # You'll need to implement these fields on your User or Employee model.
        return user.is_hod or user.is_coo or user.is_ceo
