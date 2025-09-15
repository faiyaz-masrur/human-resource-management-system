from django.contrib import admin
from .models import AppraisalTimer

@admin.register(AppraisalTimer)
class AppraisalTimerAdmin(admin.ModelAdmin):
    list_display = ('review_period_start', 'review_period_end', 'remind_date')

    def has_add_permission(self, request):
        """
        Allows adding a new object only if no AppraisalTimer instance exists yet.
        This enforces the "only one active" appraisal period.
        """
        # This will query the database to count existing objects.
        return AppraisalTimer.objects.count() == 0

    def has_delete_permission(self, request, obj=None):
        """
        Prevents deleting the last remaining instance to avoid an empty table.
        """
        return AppraisalTimer.objects.count() > 1
    
