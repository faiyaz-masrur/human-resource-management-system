#!/bin/sh

set -e

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
# This command failed previously because it was likely run with '--noinput'
# It is now fixed to run without any arguments.
python manage.py load_initial_data

# Create superuser if it does not exist
# Use ${VAR:-default} for robust default assignment in bash
email=${DJANGO_SUPERUSER_EMAIL:-noreply@sonaliintellect.com}
password=${DJANGO_SUPERUSER_PASSWORD:-admin12345@}

echo "Creating superuser if it does not exist..."
python manage.py shell -c "from django.contrib.auth import get_user_model; \
User = get_user_model(); \
User.objects.filter(email='$email').exists() or User.objects.create_superuser(email='$email', password='$password')"

# Start Gunicorn
echo "Starting Gunicorn..."
exec gunicorn backend.wsgi:application --bind 0.0.0.0:8000 --workers 2 --timeout 120