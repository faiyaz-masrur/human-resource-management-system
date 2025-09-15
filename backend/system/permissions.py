from rest_framework.permissions import BasePermission

class IsEmployee(BasePermission):
    """
    Allows access to Employees.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)
    
class IsRM(BasePermission):
    """
    Allows access only to RM users.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_rm)
 
class IsHR(BasePermission):
    """
    Allows access only to HR users.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_hr)

class IsHOD(BasePermission):
    """
    Allows access only to HOD users.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_hod)

class IsCOO(BasePermission):
    """
    Allows access only to COO users.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_coo)

class IsCEO(BasePermission):
    """
    Allows access only to the CEO.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_ceo)