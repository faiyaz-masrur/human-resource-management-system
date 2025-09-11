from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

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
    ordering = ('employee_id',)

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

# Register your models here.
admin.site.site_header = "Performance Appraisal System Admin Portal"
admin.site.site_title = "Performance Appraisal System Admin Portal"
admin.site.index_title = "Performance Appraisal System Admin Portal"

admin.site.register(User, CustomUserAdmin)
