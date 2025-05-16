FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    nodejs \
    npm \
    openssl

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy composer.json and composer.lock
COPY composer.json composer.lock ./

# Install composer dependencies
RUN composer install --no-scripts --no-autoloader

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install npm dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Generate optimized composer autoload
RUN composer dump-autoload --optimize

# Set environment variables
ENV VITE_HOST=0.0.0.0
ENV VITE_PORT=5173
ENV APP_ENV=local
ENV APP_DEBUG=true
ENV APP_URL=http://localhost:8000

# Handle HTTPS environment
ARG ENABLE_HTTPS=false
ENV ENABLE_HTTPS=${ENABLE_HTTPS}

# If HTTPS is enabled, add it to environment
RUN if [ "$ENABLE_HTTPS" = "true" ]; then \
    echo "VITE_SECURE=true" >> .env; \
    echo "Configured for HTTPS environment"; \
  fi

# Set up environment file
RUN cp .env.example .env && \
    php artisan key:generate

# Copy our custom entrypoint script
COPY docker-entrypoint-dev.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint-dev.sh

# Create SSL certificate directory
RUN mkdir -p /var/www/certs

# Copy SSL certificates if they exist
COPY certs /var/www/certs

# Change ownership of our applications
RUN chown -R www-data:www-data /var/www

# Expose ports for PHP and Vite
EXPOSE 8000 5173

# Start both Laravel and Vite dev servers
CMD ["/usr/local/bin/docker-entrypoint-dev.sh"]