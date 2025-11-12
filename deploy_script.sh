#!/bin/bash
# deploy_script.sh (on your remote server)

# Navigate to the directory containing your docker-compose.yml on the server
# NOTE: The CI job already navigated here using 'cd /path/to/your/project'

# The CI job exported $BACKEND_IMAGE and $FRONTEND_IMAGE using the 'latest' tag.

echo "Stopping and cleaning up old containers..."
# Stop existing containers and clean up unused resources
docker compose -f docker-compose.yml down
docker system prune -f

echo "Pulling latest images from the registry: $CI_REGISTRY"
# Pull the latest images referenced by the exported variables
# NOTE: The CI job already ran 'docker pull' with the CI_COMMIT_SHA tags,
# but we need to ensure the 'latest' tags (which the CI job also pushed) 
# are available and used by the compose file.

# Using 'latest' tags for simplicity, assuming they were pushed correctly.
# The `docker compose up` command below will automatically pull the images 
# defined in the file using the environment variables.

echo "Starting new containers with images:"
echo "Backend: $BACKEND_IMAGE"
echo "Frontend: $FRONTEND_IMAGE"

# Start the new containers using the images specified in the environment variables.
# The environment variables are substituted directly into the docker-compose.yml
# on the remote server via the shell.
docker compose -f docker-compose.yml up -d --remove-orphans

echo "Deployment complete."