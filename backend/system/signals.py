# signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Role, RolePermission
from .choices import WORKSPACE_SUBWORKSPACE_MAP

@receiver(post_save, sender=Role)
def create_default_role_permissions(sender, instance, created, **kwargs):
    """
    Create default role permissions when a new role is created
    """
    if created:
        for sub_workspace, workspace in WORKSPACE_SUBWORKSPACE_MAP:
            permission, created_perm = RolePermission.objects.get_or_create(
                role=instance,
                workspace=workspace,
                sub_workspace=sub_workspace,
                defaults={
                    'view': False,
                    'create': False,
                    'edit': False,
                    'delete': False
                }
            )