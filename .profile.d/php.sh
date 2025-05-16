#!/usr/bin/env bash

# Set default PORT if not specified
export PORT=${PORT:-8000}

# Make sure the environment variables are available to PHP
echo "export PORT=${PORT}" >> ~/.bashrc
echo "export APP_URL=\"https://\${RENDER_EXTERNAL_HOSTNAME}\"" >> ~/.bashrc
