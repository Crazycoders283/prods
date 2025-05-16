#!/bin/bash

# Clear Laravel caches
php artisan optimize:clear

# Update .env file with correct Vite settings
sed -i "s#VITE_PORT=.*#VITE_PORT=5173#g" .env
sed -i "s#VITE_HOST=.*#VITE_HOST=0.0.0.0#g" .env

# Add HTTPS settings for secure environments
if [[ "$ENABLE_HTTPS" == "true" ]]; then
  echo "Configuring for HTTPS environment..."
  # Add HTTPS environment variable if not present
  if ! grep -q "VITE_SECURE=" .env; then
    echo "VITE_SECURE=true" >> .env
  else
    sed -i "s#VITE_SECURE=.*#VITE_SECURE=true#g" .env
  fi
fi

echo "Starting Laravel and Vite development servers..."

# Determine Vite args based on whether HTTPS is enabled
VITE_ARGS="--host 0.0.0.0 --port 5173"
if [[ "$ENABLE_HTTPS" == "true" ]]; then
  echo "Starting Vite with HTTPS support..."
  VITE_ARGS="$VITE_ARGS --https"
fi

# Start Vite dev server in the background with appropriate args
npm run dev -- $VITE_ARGS &
VITE_PID=$!

# Start Laravel server
php artisan serve --host=0.0.0.0 --port=8000 &
LARAVEL_PID=$!

# Handle termination
trap 'kill $VITE_PID $LARAVEL_PID; exit' SIGINT SIGTERM

# Keep the script running
echo "Development servers started:"
echo "- Laravel: http://localhost:8000"
if [[ "$ENABLE_HTTPS" == "true" ]]; then
  echo "- Vite: https://localhost:5173"
else
  echo "- Vite: http://localhost:5173"
fi
echo "Press Ctrl+C to stop both servers."

# Wait for both processes
wait $VITE_PID $LARAVEL_PID 