.PHONY: up down restart build shell logs buildx-push buildx-multi certs

# Start the development environment
up:
	ENABLE_HTTPS=$(ENABLE_HTTPS) docker-compose up -d

# Stop the development environment
down:
	docker-compose down

# Restart the development environment
restart:
	ENABLE_HTTPS=$(ENABLE_HTTPS) docker-compose restart

# Build the development environment
build:
	ENABLE_HTTPS=$(ENABLE_HTTPS) docker-compose build --no-cache

# Enter the container shell
shell:
	docker-compose exec app bash

# View logs
logs:
	docker-compose logs -f

# Run artisan commands
artisan:
	docker-compose exec app php artisan $(filter-out $@,$(MAKECMDGOALS))

# Run npm commands
npm:
	docker-compose exec app npm $(filter-out $@,$(MAKECMDGOALS))

# Install dependencies
install:
	docker-compose exec app composer install
	docker-compose exec app npm install

# Generate SSL certificates for HTTPS
certs:
	./generate-certs.sh

# Build with Buildx and push to registry
buildx-push:
	ENABLE_HTTPS=$(ENABLE_HTTPS) ./build-push.sh --registry=$(REGISTRY) --tag=$(TAG)

# Build multi-platform images and push
buildx-multi:
	ENABLE_HTTPS=$(ENABLE_HTTPS) ./build-push.sh --registry=$(REGISTRY) --tag=$(TAG) --platforms="linux/amd64,linux/arm64"

# Catch-all for passing arguments
%:
	@: 