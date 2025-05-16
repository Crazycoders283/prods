#!/usr/bin/env bash
# exit on error
set -o errexit

# Skip PHP/Laravel operations since we'll rely on Render's built-in PHP support
# Render automatically handles PHP installation for PHP web services

# Install NPM dependencies
npm ci

# Build frontend
npm run build

# Storage permissions
chmod -R 775 storage bootstrap/cache
