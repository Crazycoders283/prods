#!/bin/bash

# This script removes Laravel/PHP files while preserving the React frontend

# Make a backup of important frontend files
mkdir -p backup/resources/js
cp -r resources/js/pages backup/resources/js/
cp -r resources/js/Components backup/resources/js/
cp -r resources/js/Layouts backup/resources/js/
cp -r resources/js/app.jsx backup/resources/js/

# Remove Laravel-specific files and directories
rm -rf app
rm -rf bootstrap
rm -rf config
rm -rf database
rm -rf routes
rm -rf storage
rm -rf tests
rm -rf vendor
rm -f artisan
rm -f phpunit.xml
rm -f composer.json
rm -f composer.lock

# Move backed up files back
cp -r resources resources_orig
rm -rf resources
mkdir -p resources/js
cp -r backup/resources/js/* resources/js/
cp -r resources_orig/css resources/
rm -rf resources_orig

echo "Cleanup completed. Laravel files removed, React frontend preserved."
