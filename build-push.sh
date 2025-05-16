#!/bin/bash

# Default to HTTPS enabled for production
USE_HTTPS=${ENABLE_HTTPS:-true}

# Generate SSL certificates if HTTPS is enabled and they don't exist
if [[ "$USE_HTTPS" == "true" ]]; then
  if [ ! -f "certs/cert.pem" ] || [ ! -f "certs/key.pem" ]; then
    echo "SSL certificates not found. Generating self-signed certificates..."
    ./generate-certs.sh
  fi
fi

# Build and push the image using Docker Buildx
docker buildx build \
  --platform linux/amd64 \
  --tag teja083/jet-setters:latest \
  --push \
  --file Dockerfile \
  --build-arg ENABLE_HTTPS=${USE_HTTPS} \
  . 