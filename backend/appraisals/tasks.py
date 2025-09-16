from celery import shared_task
from django.core.management import call_command
import logging

logger = logging.getLogger(__name__)

@shared_task
def update_appraisal_timers_task():
    """
    Calls the management command to update all appraisal timers for the year.
    """
    try:
        call_command('update_appraisal_timer')
        logger.info("Appraisal timers updated successfully via Celery.")
    except Exception as e:
        logger.error(f"Failed to update appraisal timers via Celery: {e}", exc_info=True)
