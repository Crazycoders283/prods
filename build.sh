#!/bin/bash
set -e

# Get PHP version from the environment or use 8.2 as default
PHP_VERSION=${PHP_VERSION:-"8.2"}
echo "Using PHP version: $PHP_VERSION"

# Check if we're on Render
if [ -d "/opt/render" ]; then
    echo "Running on Render platform"
    # On Render, we expect the heroku-php buildpack environment
    export PATH="$PATH:/app/.heroku/php/bin:/app/.heroku/php/sbin"
fi

# Install Composer dependencies for production
if command -v composer &> /dev/null; then
    echo "Installing Composer dependencies..."
    composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev
else
    echo "Composer not found. Skipping dependency installation."
fi

# Install NPM dependencies for production
echo "Installing NPM dependencies..."
npm ci

# Build frontend assets with Vite
echo "Building frontend assets..."
npm run build

# Run Laravel optimizations if PHP is available
if command -v php &> /dev/null; then
    echo "Running Laravel optimizations..."
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
else
    echo "PHP not found. Skipping Laravel optimizations."
fi

# Set proper permissions for Laravel storage and cache
echo "Setting proper permissions..."
chmod -R 755 storage bootstrap/cache

# Create storage link if PHP is available
if command -v php &> /dev/null; then
    echo "Creating storage link..."
    php artisan storage:link
fi

echo "Build completed successfully!"

