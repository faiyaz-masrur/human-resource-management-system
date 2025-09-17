from django.apps import AppConfig

class NotificationsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'notifications'

    def ready(self):
        """
        Import signals here to ensure they are registered when the app loads.
        """
        import backend.notifications.dashboard_notifications
