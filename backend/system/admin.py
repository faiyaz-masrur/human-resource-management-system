from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import Group
from .models import User, Department, Designation, Grade, SubGrade

class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ('email', 'employee_id', 'is_staff', 'is_superuser', 'is_active')
    list_display_links = ('email', 'employee_id')
    list_filter = ('employee_id', 'is_staff', 'is_superuser', 'is_active')
    fieldsets = (
        (None, {'fields': ('employee_id', 'email', 'password')}),
        ('Permissions', {
            'fields': ('is_rm', 'is_hr', 'is_hod', 'is_coo', 'is_ceo', 'is_staff', 'is_superuser', 'is_active'),
        }),
        ('Dates', {'fields': ('last_login',)}),
    )
    search_fields = ('email', 'employee_id')
    ordering = ('email',)

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    model = Department
    list_display = ("name",)
    search_fields = ("name",)
    ordering = ("name",)

    fieldsets = (
        ("Basic Info", {
            "fields": ("name", "description"),
        }),
    )


@admin.register(Designation)
class DesignationAdmin(admin.ModelAdmin):
    list_display = ("name", "department")
    list_filter = ("department",)
    search_fields = ("name", "department__name")
    ordering = ("department", "name")

    fieldsets = (
        ("Designation Details", {
            "fields": ("name", "department", "description"),
        }),
    )


@admin.register(Grade)
class GradeAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)
    ordering = ("name",)

    fieldsets = (
        ("Grade Information", {
            "fields": ("name", "description"),
        }),
    )


@admin.register(SubGrade)
class SubGradeAdmin(admin.ModelAdmin):
    list_display = ("name", "grade")
    list_filter = ("grade",)
    search_fields = ("name", "grade__name")
    ordering = ("grade", "name")

    fieldsets = (
        ("Subgrade Details", {
            "fields": ("name", "grade", "description"),
        }),
    )

# Register your models here.
admin.site.site_header = "Performance Appraisal System Admin Portal"
admin.site.site_title = "Performance Appraisal System Admin Portal"
admin.site.index_title = "Performance Appraisal System Admin Portal"

admin.site.register(User, CustomUserAdmin)
admin.site.unregister(Group)

