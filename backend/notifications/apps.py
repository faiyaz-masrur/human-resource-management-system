# notifications/apps.py
import sys
import logging
from django.apps import AppConfig
from django.contrib import admin
from django.conf import settings

logger = logging.getLogger(__name__)

class NotificationsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'notifications'

    def ready(self):
        # Start the scheduler safely
        if "runserver" in sys.argv:
            try:
                from .scheduler import start_scheduler
                start_scheduler()
                logger.info("Scheduler started successfully.")
            except Exception as e:
                logger.error(f"Failed to start scheduler: {e}")

        # Hide Django APScheduler models from admin
        try:
            from django_apscheduler.models import DjangoJob, DjangoJobExecution
            for model in [DjangoJob, DjangoJobExecution]:
                try:
                    admin.site.unregister(model)
                    logger.info(f"Unregistered {model.__name__} from admin.")
                except admin.sites.NotRegistered:
                    pass  # Already unregistered or never registered
        except ImportError:
            logger.warning("django-apscheduler is not installed; skipping admin unregister.")
