from django.contrib import admin
from django.contrib.auth.models import Group
from .models import (
    Department, 
    Designation, 
    Grade, 
    Employee, 
    Role,
    BloodGroup,
    MaritalStatus,
    EmergencyContactRelationship,
    Degree,
    Specialization,
    BdDistrict,
    BdThana,
    RolePermission,
)
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    model = Department
    list_display = ("id", "name",)
    search_fields = ("name",)
    ordering = ("name",)

    fieldsets = (
        ("Basic Info", {
            "fields": ("id", "name", "description"),
        }),
    )

    readonly_fields = ('id',)
    


@admin.register(Grade)
class GradeAdmin(admin.ModelAdmin):
    list_display = ("id", "name",)
    search_fields = ("name",)
    ordering = ("name",)

    fieldsets = (
        ("Grade Information", {
            "fields": ("id", "name", "description"),
        }),
    )

    readonly_fields = ('id',)



@admin.register(Designation)
class DesignationAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "grade")
    search_fields = ("name", "grade__name")
    ordering = ("grade", "name",)

    fieldsets = (
        ("Designation Details", {
            "fields": ("id", "name", "grade", "description"),
        }),
    )

    readonly_fields = ('id',)


@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ("id", "name",)
    search_fields = ("name",)
    ordering = ("name",)

    fieldsets = (
        ("Role Details", {
            "fields": ("id", "name", "description"),
        }),
    )

    readonly_fields = ('id',)
    
@admin.register(RolePermission)
class RolePermissionAdmin(admin.ModelAdmin):
    list_display = ("role__name", "workspace", "sub_workspace",)
    search_fields = ("role__name", "worksapce", "sub_workspace")
    ordering = ("role__name",)

    fieldsets = (
        ("Role Permission Details", {
            "fields": ("role", "workspace", "sub_workspace", "view", "create", "edit", "delete"),
        }),
    )

    readonly_fields = ('id',)
    



@admin.register(BloodGroup)
class BloodGroupAdmin(admin.ModelAdmin):
    list_display = ("id", "name",)
    search_fields = ("name",)
    ordering = ("name",)

    fieldsets = (
        ("Blood Group Details", {
            "fields": ("id", "name", "description"),
        }),
    )

    readonly_fields = ('id',)


@admin.register(MaritalStatus)
class MaritalStatusAdmin(admin.ModelAdmin):
    list_display = ("id", "name",)
    search_fields = ("name",)
    ordering = ("name",)

    fieldsets = (
        ("Marital Status Details", {
            "fields": ("id", "name", "description"),
        }),
    )

    readonly_fields = ('id',)


@admin.register(EmergencyContactRelationship)
class EmergencyContactRelationshipAdmin(admin.ModelAdmin):
    list_display = ("id", "name",)
    search_fields = ("name",)
    ordering = ("name",)

    fieldsets = (
        ("Emergency Contact Relationship Details", {
            "fields": ("id", "name", "description"),
        }),
    )

    readonly_fields = ('id',)


@admin.register(Degree)
class DegreeAdmin(admin.ModelAdmin):
    list_display = ("id", "name",)
    search_fields = ("name",)
    ordering = ("name",)

    fieldsets = (
        ("Degree Details", {
            "fields": ("id", "name", "description"),
        }),
    )

    readonly_fields = ('id',)


@admin.register(Specialization)
class SpecializationAdmin(admin.ModelAdmin):
    list_display = ("id", "name",)
    search_fields = ("name",)
    ordering = ("name",)

    fieldsets = (
        ("Specialization Details", {
            "fields": ("id", "name", "description"),
        }),
    )

    readonly_fields = ('id',)


@admin.register(BdDistrict)
class BdDistrictAdmin(admin.ModelAdmin):
    list_display = ("id", "name",)
    search_fields = ("name",)
    ordering = ("name",)

    fieldsets = (
        ("District Details", {
            "fields": ("id", "name", "description"),
        }),
    )

    readonly_fields = ('id',)


@admin.register(BdThana)
class BdThanaAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "district")
    search_fields = ("name", "district__name")
    ordering = ("district", "name",)

    fieldsets = (
        ("Thana Details", {
            "fields": ("id", "name", "district", "description"),
        }),
    )

    readonly_fields = ('id',)


# Register your models here.
admin.site.site_header = "Performance Appraisal System Admin Portal"
admin.site.site_title = "Performance Appraisal System Admin Portal"
admin.site.index_title = "Performance Appraisal System Admin Portal"

admin.site.register(Employee)
admin.site.unregister(Group)
admin.site.unregister(BlacklistedToken)
admin.site.unregister(OutstandingToken)



