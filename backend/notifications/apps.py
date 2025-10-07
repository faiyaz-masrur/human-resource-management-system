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
        # 1. Start the scheduler safely (Only once, and correctly importing from 'timers')
        if "runserver" in sys.argv:
            try:
                # CORRECTED: Use dot-notation for relative imports within the app's structure
                # The structure in the image shows 'timers' is a sub-directory/module
                # and 'scheduler.py' is inside it.
                from .timers.scheduler import start_scheduler 
                start_scheduler()
                logger.info("Scheduler started successfully.")
            except ImportError:
                # Log a more specific error for clarity
                logger.error("Could not find or import 'notifications.timers.scheduler'. Ensure the file exists.")
            except Exception as e:
                logger.error(f"Failed to start scheduler: {e}")

        # 2. Hide Django APScheduler models from admin
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
        
       
        # 3. Import signals modules to ensure they are registered
        # The structure in the image shows set_appraisal_timer.py and reset_appraisal_year.py 
        # are inside the 'timers' subdirectory.
        try:
            # CORRECTED: Use dot-notation for relative imports within the app's structure ('timers' directory)
            from .timers import set_appraisal_timer 
            from .timers import reset_appraisal_year
            logger.info("Signals modules imported for registration.")
        except ImportError as e:
            # Handle case where the file might not exist yet or path is wrong
            logger.warning(f"Could not import signal/timer modules: {e}")

        # REMOVED: Duplicate and incorrect scheduler start logic
        # The scheduler is already started in step 1.
        # The original code's second attempt was also using 'from . import scheduler'
        # which would look for 'notifications/scheduler.py', but the file is in 'notifications/timers/scheduler.py'.
        # The logic in step 1 handles the correct import and start.