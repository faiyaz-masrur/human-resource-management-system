#!/bin/sh
set -e

CMD=${1:-web}

DB_PORT=${DB_PORT:-3306}
WORKERS=${GUNICORN_WORKERS:-2}
TIMEOUT=${GUNICORN_TIMEOUT:-120}

wait_for_db() {
  echo "Waiting for database at $DB_HOST:$DB_PORT ..."
  retries=40
  until nc -z "$DB_HOST" "$DB_PORT"; do
    retries=$((retries - 1))
    if [ $retries -le 0 ]; then
      echo "ERROR: Database is not reachable after multiple attempts. Exiting."
      exit 1
    fi
    echo "Database not ready, retrying in 2s... ($retries retries left)"
    sleep 2
  done
  # Give DB a little extra time to fully initialize
  sleep 3
  echo "Database is ready."
}

create_super_user() {
  email=${DJANGO_SUPERUSER_EMAIL:-admin@example.com}
  password=${DJANGO_SUPERUSER_PASSWORD:-admin12345@}

  echo "Ensuring Django superuser exists..."
  python manage.py shell << END
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(email="$email").exists():
    User.objects.create_superuser(email="$email", password="$password")
    print("Superuser created: $email")
else:
    print("Superuser already exists: $email")
END
}

load_initial_data_safe() {
  if python manage.py help | grep -q load_initial_data; then
    echo "Loading initial data..."
    python manage.py load_initial_data || echo "Initial data load failed or skipped."
  else
    echo "No custom load_initial_data command found, skipping."
  fi
}

if [ "$CMD" = "web" ]; then

  wait_for_db

  echo "Running Django database checks..."
  python manage.py check --database default || echo "Django check returned warnings."

  echo "Applying migrations..."
  python manage.py migrate --noinput

  echo "Collecting static files..."
  python manage.py collectstatic --noinput

  load_initial_data_safe
  create_super_user

  echo "Starting Gunicorn server..."
  exec gunicorn backend.wsgi:application \
      --bind 0.0.0.0:8005 \
      --workers "$WORKERS" \
      --timeout "$TIMEOUT"

elif [ "$CMD" = "worker" ]; then
  echo "Starting Celery Worker..."
  exec celery -A backend worker -l info

elif [ "$CMD" = "beat" ]; then
  echo "Starting Celery Beat..."
  exec celery -A backend beat -l info

else
  echo "Executing custom command: $@"
  exec "$@"
fi