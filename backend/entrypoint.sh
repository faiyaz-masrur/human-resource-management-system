#!/bin/sh
set -e

: "${DB_HOST:?DB_HOST required}"
: "${DB_PORT:=3306}"

echo "Waiting for database at $DB_HOST:$DB_PORT..."
max_retries=30
count=0
until nc -z "$DB_HOST" "$DB_PORT"; do
  count=$((count+1))
  if [ $count -ge $max_retries ]; then
    echo "Database not available after $max_retries attempts, exiting."
    exit 1
  fi
  echo "Database not ready, waiting 2 seconds... ($count/$max_retries)"
  sleep 2
done
echo "Database is up!"

# Redis
: "${REDIS_HOST:?REDIS_HOST required}"
: "${REDIS_PORT:=6379}"
echo "Waiting for Redis at $REDIS_HOST:$REDIS_PORT..."
count=0
until nc -z "$REDIS_HOST" "$REDIS_PORT"; do
  count=$((count+1))
  if [ $count -ge $max_retries ]; then
    echo "Redis not available after $max_retries attempts, exiting."
    exit 1
  fi
  echo "Redis not ready, waiting 2 seconds... ($count/$max_retries)"
  sleep 2
done
echo "Redis is up!"

# Apply migrations (noinput)
echo "Applying database migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput || true

# Optional initial data (make sure it's idempotent)
if python manage.py help | grep -q load_initial_data; then
  echo "Loading initial data..."
  python manage.py load_initial_data || true
fi

# Create superuser in a safer way (avoid exposing password in shell)
if [ -n "$DJANGO_SUPERUSER_EMAIL" ] && [ -n "$DJANGO_SUPERUSER_PASSWORD" ]; then
  echo "Creating superuser if it does not exist..."

python manage.py shell << END
from django.contrib.auth import get_user_model
User = get_user_model()

email = "$DJANGO_SUPERUSER_EMAIL"
pw = "$DJANGO_SUPERUSER_PASSWORD"

if not User.objects.filter(email=email).exists():
  User.objects.create_superuser(email=email, password=pw)
  print("Superuser created:", email)
else:
  print("Superuser already exists:", email)
END

else
  echo "DJANGO_SUPERUSER_EMAIL and/or DJANGO_SUPERUSER_PASSWORD not set; skipping superuser creation."
fi


echo "Starting Gunicorn..."
exec gunicorn backend.wsgi:application --bind 0.0.0.0:8000 --workers 2 --timeout 120
