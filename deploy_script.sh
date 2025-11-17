#!/bin/bash
# deploy_script.sh (on your remote server)

# Set -e to ensure the script exits immediately if any command fails
set -e

#echo "Stopping and cleaning up old containers..."
# Stop existing containers and clean up unused resources
#docker compose -f docker-compose.yml down
#docker system prune -f

echo "Starting new containers with images (Forcibly pulling latest from registry):"
echo "Backend: $BACKEND_IMAGE"
echo "Frontend: $FRONTEND_IMAGE"

# Start the new containers.
# --pull always: Forces a pull of the image defined by the environment variables
# -d: Run in detached mode
# --remove-orphans: Removes containers for services no longer defined in the compose file
docker compose -f docker-compose.yml up -d --remove-orphans --pull always

echo "Deployment complete."