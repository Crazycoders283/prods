#!/bin/bash

# Clear existing build files
echo "Clearing existing build files..."
rm -rf public/build

# Ensure the build directory exists with proper permissions
echo "Creating build directory with proper permissions..."
mkdir -p public/build
chmod -R 775 public/build

# Install dependencies if needed
if [ "$1" == "--fresh" ]; then
    echo "Installing npm dependencies..."
    npm install
fi

# Build assets
echo "Building Vite assets..."
npm run build

# Verify the manifest file exists
if [ -f "public/build/.vite/manifest.json" ]; then
    echo "✅ Manifest file created successfully!"
    cat public/build/.vite/manifest.json
else
    echo "❌ Manifest file was not created! Check for errors above."
    exit 1
fi

echo "Build completed successfully!" 