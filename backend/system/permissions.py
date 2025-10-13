from rest_framework.permissions import BasePermission
from .models import RolePermission


class HasRoleWorkspacePermission(BasePermission):
    """
    Checks if user's role has view/create/edit/delete access
    for a given workspace and sub_workspace.
    """

    def has_permission(self, request, view):
        user = request.user

        # 1️⃣ Must be authenticated
        if not (user and user.is_authenticated):
            return False

        # 2️⃣ Must have a role assigned
        if not user.role:
            return False

        # 3️⃣ Workspace and Sub-workspace should be defined in the view
        workspace = getattr(view, "workspace", None)
        sub_workspace = getattr(view, "sub_workspace", None)

        if not workspace or not sub_workspace:
            # You can choose to raise an error or just return False
            return False

        # 4️⃣ Try to fetch the permission record
        try:
            permission = RolePermission.objects.get(
                role=user.role, workspace=workspace, sub_workspace=sub_workspace
            )
        except RolePermission.DoesNotExist:
            return False

        # 5️⃣ Map HTTP method → permission field
        method_map = {
            "GET": permission.view,      # list, retrieve
            "POST": permission.create,   # create
            "PUT": permission.edit,      # full update
            "PATCH": permission.edit,    # partial update
            "DELETE": permission.delete, # delete
        }

        # Return permission status for current method
        return method_map.get(request.method, False)
