from django.apps import AppConfig


class JobsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'jobs'
    default = True

    def ready(self):
        """
        Import signals when Django app is ready
        """
        import jobs.signals
