from django.contrib import admin
from django.contrib.auth.models import Group
from .models import Department, Designation, Grade
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken


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


@admin.register(Designation)
class DesignationAdmin(admin.ModelAdmin):
    list_display = ("name", "grade")
    search_fields = ("name", "grade__name")
    ordering = ("grade", "name",)

    fieldsets = (
        ("Designation Details", {
            "fields": ("name", "grade", "description"),
        }),
    )


# Register your models here.
admin.site.site_header = "Performance Appraisal System Admin Portal"
admin.site.site_title = "Performance Appraisal System Admin Portal"
admin.site.index_title = "Performance Appraisal System Admin Portal"

admin.site.unregister(Group)
admin.site.unregister(BlacklistedToken)
admin.site.unregister(OutstandingToken)
