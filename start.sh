#!/bin/bash
set -e

# This script is used by Render to start the application
# The main command will be specified in render.yaml as startCommand
# But we can perform some pre-start tasks here

echo "Starting application in Render environment..."

# Check if we're on Render
if [ -d "/opt/render" ]; then
    echo "Running on Render platform"
    # On Render, we expect the heroku-php buildpack environment
    export PATH="$PATH:/app/.heroku/php/bin:/app/.heroku/php/sbin"
fi

# Ensure storage directory is writable
echo "Setting storage permissions..."
chmod -R 777 storage bootstrap/cache

# Test Supabase connection
echo "Testing Supabase connection..."
node -e "
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
supabase.from('users').select('count').single()
  .then(() => console.log('✅ Supabase connection successful'))
  .catch(err => {
    console.error('❌ Supabase connection failed:', err);
    process.exit(1);
  });
"

# Check if we can access PHP
if command -v php &> /dev/null; then
    echo "PHP is available. Warming up application..."
    # Clear any cached views since this is a fresh start
    php artisan view:clear
    
    # Verify database connection
    php artisan migrate --force --no-interaction
    
    # Link storage if needed
    php artisan storage:link --force
else
    echo "PHP not found. Skipping Laravel pre-start tasks."
fi

# In render.yaml, the actual web server will be started with:
# heroku-php-apache2 -p ${PORT:-8000} public/

echo "Pre-start tasks completed. Starting the application..."