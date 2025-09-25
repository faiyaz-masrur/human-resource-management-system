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
        user = request.user
        return (
            bool(user and user.is_authenticated) and 
            (user.role1 == "RM" or user.role2 == "RM")
        )
 

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
        user = request.user
        return (
            bool(user and user.is_authenticated) and 
            (user.role1 == "HOD" or user.role2 == "HOD")
        )


class IsCOO(BasePermission):
    """
    Allows access only to COO users.
    """
    def has_permission(self, request, view):
        user = request.user
        return (
            bool(user and user.is_authenticated) and 
            (user.role1 == "COO" or user.role2 == "COO")
        )


class IsCEO(BasePermission):
    """
    Allows access only to the CEO.
    """
    def has_permission(self, request, view):
        user = request.user
        return (
            bool(user and user.is_authenticated) and 
            (user.role1 == "CEO" or user.role2 == "CEO")
        )
