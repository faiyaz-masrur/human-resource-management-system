# notifications/scheduler.py
import logging
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from django_apscheduler.jobstores import DjangoJobStore
from django.conf import settings

logger = logging.getLogger(__name__)

def my_scheduled_job():
    logger.info("Running scheduled job...")
    # Place your task logic here
    # e.g., send_review_notifications()

scheduler = None  # make scheduler module-level so you can access it if needed

def start_scheduler():
    global scheduler
    if scheduler is not None:
        logger.info("Scheduler already running. Skipping start.")
        return

    scheduler = BackgroundScheduler(timezone=settings.TIME_ZONE)
    scheduler.add_jobstore(DjangoJobStore(), "default")

    # Example: run every day at 9am
    scheduler.add_job(
        my_scheduled_job,
        trigger=CronTrigger(hour=9, minute=0),
        id="daily_review_job",
        max_instances=1,
        replace_existing=True,
    )

    scheduler.start()
    logger.info("Scheduler started.")
