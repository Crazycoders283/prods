#!/bin/bash

# Default values
REGISTRY=${DOCKER_REGISTRY:-localhost}
IMAGE_NAME="cruise-app"
TAG=${TAG:-latest}
PLATFORMS=${PLATFORMS:-"linux/amd64"}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --registry=*)
      REGISTRY="${1#*=}"
      shift
      ;;
    --tag=*)
      TAG="${1#*=}"
      shift
      ;;
    --platforms=*)
      PLATFORMS="${1#*=}"
      shift
      ;;
    *)
      # Unknown option
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

# Full image name with tag
FULL_IMAGE_NAME="$REGISTRY/$IMAGE_NAME:$TAG"

echo "=== Building and pushing $FULL_IMAGE_NAME for platforms: $PLATFORMS ==="

# Create a new builder instance if it doesn't exist
if ! docker buildx inspect builder &>/dev/null; then
  echo "Creating new buildx builder instance..."
  docker buildx create --name builder --use
fi

# Build and push the image
echo "Building and pushing image using buildx..."
docker buildx build \
  --platform $PLATFORMS \
  --tag $FULL_IMAGE_NAME \
  --push \
  --file Dockerfile \
  .

if [ $? -eq 0 ]; then
  echo "=== Successfully built and pushed $FULL_IMAGE_NAME ==="
  
  # Run the container if requested
  if [[ "$RUN_AFTER_PUSH" == "true" ]]; then
    echo "Starting containers..."
    DOCKER_REGISTRY="$REGISTRY" TAG="$TAG" docker-compose up -d
  fi
else
  echo "=== Failed to build and push $FULL_IMAGE_NAME ==="
  exit 1
fi 