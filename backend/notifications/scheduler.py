# notifications/scheduler.py
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from django_apscheduler.jobstores import DjangoJobStore
import logging

logger = logging.getLogger(__name__)

def my_scheduled_job():
    logger.info("Running scheduled job...")
    # Place your task logic here
    # e.g., send_review_notifications()

def start_scheduler():
    scheduler = BackgroundScheduler()
    scheduler.add_jobstore(DjangoJobStore(), "default")

    # Example: run every day at 9am
    scheduler.add_job(
        my_scheduled_job,
        trigger=CronTrigger(hour=9, minute=0),
        id="daily_review_job",
        max_instances=1,
        replace_existing=True,
    )
    logger.info("Scheduler started...")
    scheduler.start()
