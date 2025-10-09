from apscheduler.schedulers.background import BackgroundScheduler
from django_apscheduler.jobstores import DjangoJobStore
from django.core.management import call_command
import logging
import sys

logger = logging.getLogger(__name__)

# Use a module-level variable to store the scheduler instance
scheduler = None

def daily_scheduled_tasks():
    """
    Wrapper function to run all daily scheduled tasks at once.
    This includes checking for appraisal year reset and sending time-based notifications.
    """
    # 1. Run the Appraisal Year Reset Check (command name is 'reset_appraisal_year')
    try:
        logger.info("Starting scheduled task: reset_appraisal_year command.")
        call_command('reset_appraisal_year') 
    except Exception as e:
        logger.error(f"Error running reset_appraisal_year command: {e}")

    # 2. Run the Notification Sender Check (command name is 'send_appraisal_time_notification')
    try:
        logger.info("Starting scheduled task: send_appraisal_time_notification command.")
        # CORRECTED: Using call_command instead of a failed direct import/function call
        call_command('send_appraisal_time_notification')
    except Exception as e:
        logger.error(f"Error running send_appraisal_time_notification command: {e}")


def start_scheduler():
    """Initializes and starts the APScheduler, defining the single daily job."""
    global scheduler
    
    # 1. Process Check: Only start the scheduler if running as the main web server process.
    is_server_process = any(arg in sys.argv for arg in ['runserver', 'gunicorn', 'uwsgi'])
    
    if not is_server_process:
        return
        
    # 2. Prevent redundant startup within the same process
    if scheduler and scheduler.running:
        logger.info("Scheduler already running in this process. Skipping start.")
        return

    # 3. Initialize and configure the scheduler
    scheduler = BackgroundScheduler()
    scheduler.add_jobstore(DjangoJobStore(), "default")

    # Define the single job that executes all required daily checks
    scheduler.add_job(
        func=daily_scheduled_tasks, # Runs the function that handles both tasks
        trigger='cron',
        # Set to run every day at 9 AM (based on TIME_ZONE in settings.py)
        hour=9, 
        minute=0, 
        id='daily_combined_checks',
        name='Daily Combined Appraisal & Notification Check (9 AM)',
        replace_existing=True
    )
    logger.info("Scheduled job: Daily Combined Appraisal & Notification Check (runs at 9 AM).")

    # 4. Start the scheduler
    try:
        logger.info("Starting APScheduler...")
        scheduler.start()
    except Exception as e:
        # This handles common startup errors, like DB not being ready yet
        logger.error(f"Scheduler failed to start: {e}")