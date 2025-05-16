#!/bin/bash

# Ensure the build directory has correct permissions
mkdir -p /var/www/public/build/.vite
mkdir -p /var/www/public/build/assets
chmod -R 775 /var/www/public/build
chown -R www-data:www-data /var/www/public

# Check if manifest file exists
if [ ! -f "/var/www/public/build/.vite/manifest.json" ]; then
    echo "Vite manifest not found. Creating it..."
    
    # Create a basic manifest file
    cat > /var/www/public/build/.vite/manifest.json << EOL
{
  "resources/js/app.jsx": {
    "file": "assets/app.js",
    "src": "resources/js/app.jsx",
    "isEntry": true,
    "css": ["assets/app.css"]
  }
}
EOL

    # Create placeholder files
    echo "// Placeholder file" > /var/www/public/build/assets/app.js
    echo "/* Placeholder file */" > /var/www/public/build/assets/app.css
    
    echo "Created placeholder Vite manifest and asset files."
fi

# Clear Laravel cache
php artisan optimize:clear

# Start the PHP server
exec php artisan serve --host=0.0.0.0 --port=8000 