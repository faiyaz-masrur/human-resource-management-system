from django.contrib.auth.models import BaseUserManager
from django.utils.translation import gettext_lazy as _
from django.utils.crypto import get_random_string


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError(_('The Email field must be set'))
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, id=None, **extra_fields):
        from .models import Role, generate_employee_id
        from employees.serializers import EmployeeOfficialDetailSerializer

        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if not id:
            id = generate_employee_id()

        raw_password = get_random_string(length=8)

        super_role, _ = Role.objects.get_or_create(name="SUPER")

        data = {
            "id": id,
            "email": email,
            "raw_password": raw_password,
            **extra_fields,
        }

        serializer = EmployeeOfficialDetailSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        employee = serializer.save(role=super_role)  # save role directly

        print(f"Superuser created! Email: {email}, Password: {raw_password}")
        return employee
