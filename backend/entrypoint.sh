#!/bin/sh

# Set fail fast
set -e

# Define the command to be executed (default to 'web' if no command is provided)
CMD=${1:-web}

# --- Common Setup for 'web' and other commands that need the database ---
if [ "$CMD" = "web" ]; then
  
  # Wait for database to be ready
  echo "Waiting for database at $DB_HOST:3306..."
  until nc -z "$DB_HOST" 3306; do
    echo "Database not ready, waiting 2 seconds..."
    sleep 2
  done
  echo "Database is up!"

  # Apply migrations
  echo "Applying database migrations..."
  python manage.py migrate --noinput

  echo "Collecting static files..."
  python manage.py collectstatic --noinput

  echo "Load initial data..."
  python manage.py load_initial_data

  # Create superuser if it does not exist
  email=${DJANGO_SUPERUSER_EMAIL:-noreply@sonaliintellect.com}
  password=${DJANGO_SUPERUSER_PASSWORD:-admin12345@}

  echo "Creating superuser if it does not exist..."
  python manage.py shell -c "from django.contrib.auth import get_user_model; \
User = get_user_model(); \
User.objects.filter(email='$email').exists() or User.objects.create_superuser(email='$email', password='$password')"

  # Execute the web server command
  echo "Starting Gunicorn..."
  exec gunicorn backend.wsgi:application --bind 0.0.0.0:8005 --workers 2 --timeout 120

elif [ "$CMD" = "worker" ]; then
  # --- Celery Worker Command ---
  # NOTE: Celery requires a broker (like Redis or RabbitMQ) defined in your Django settings
  echo "Starting Celery Worker..."
  # The -A backend assumes your Celery app is initialized in your Django project's backend/ directory
  exec celery -A backend worker -l info

elif [ "$CMD" = "beat" ]; then
  # --- Celery Beat Command (for scheduled tasks) ---
  # NOTE: If using django-celery-beat, use --scheduler django_celery_beat.schedulers.DatabaseScheduler
  echo "Starting Celery Beat..."
  exec celery -A backend beat -l info

else
  # Execute default command (e.g., if you run `docker exec ... /bin/bash`)
  echo "Executing default command: $@"
  exec "$@"
fi