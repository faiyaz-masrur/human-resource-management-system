#!/bin/bash
# deploy_script.sh (on your remote server)

# Navigate to the directory containing your docker-compose.yml on the server
cd /path/to/your/project

# Stop existing containers and clean up unused resources
docker compose down
docker system prune -f

# IMPORTANT: Update your docker-compose.yml to use the pushed image tags
# (This is a simplified step; a better solution is to generate the docker-compose file 
# in the CI/CD job and upload it, or use a tool like Ansible/Kubernetes/ECS)
# Assuming a temporary replacement:
# Example: Replace 'build: ./backend' with 'image: $BACKEND_IMAGE' (requires advanced scripting)

# For a simple setup, you can temporarily modify the docker-compose file or use 
# image tags directly in the remote script if not using the 'build' context in CI.

# Start the new containers using the updated images. 
# You need to ensure the image tags ($BACKEND_IMAGE, $FRONTEND_IMAGE) are correctly 
# passed or resolved in the docker-compose file on the server.
docker compose -f docker-compose.yml up -d 

echo "Deployment complete."