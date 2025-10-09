# notifications/apps.py

from django.apps import AppConfig
# import logging  # You can keep this if you're using it, but not mandatory here

# logger = logging.getLogger(__name__) # Same here

class NotificationsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    
    # <<< THIS LINE WAS MISSING OR INCORRECT >>>
    name = 'notifications' 
    # <<< ----------------------------------- >>>

    # If you included the scheduler logic, it might look like this:
    def ready(self):
        # Your scheduler startup code here (make sure it's correct)
        try:
            from . import scheduler
            scheduler.start_scheduler()
        except ImportError:
            pass # Or handle the import error better
        except Exception as e:
            # You might want to log this error instead of printing
            print(f"Error starting scheduler: {e}")