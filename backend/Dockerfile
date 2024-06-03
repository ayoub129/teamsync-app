# Use an official PHP runtime as a parent image
FROM php:8.2-apache

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libldap2-dev \
    && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-configure ldap --with-libdir=lib/x86_64-linux-gnu \
    && docker-php-ext-install ldap \
    && docker-php-ext-install pdo pdo_mysql

# Composer
COPY --from=composer:2.3.5 /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy the current directory contents into the container at /var/www
COPY . /var/www

# Create the entrypoint.sh script
RUN echo '#!/bin/bash\n\
if [ ! -f "vendor/autoload.php" ]; then\n\
    composer install --no-progress --no-interaction\n\
fi\n\
if [ ! -f ".env" ]; then\n\
    echo "Creating env file for env $APP_ENV"\n\
    cp .env.example .env\n\
else\n\
    echo "env file exists."\n\
fi\n\
php artisan vendor:publish --provider="LdapRecord\\Laravel\\LdapServiceProvider"\n\
php artisan migrate\n\
php artisan cache:clear\n\
php artisan config:clear\n\
php artisan key:generate\n\
php artisan storage:link\n\
chmod -R 775 storage\n\
chown -R www-data:www-data storage\n\
php artisan serve --port=$PORT --host=0.0.0.0 --env=.env\n\
exec docker-php-entrypoint "$@"' > /usr/local/bin/entrypoint.sh

# Ensure the entrypoint script is executable
RUN chmod +x /usr/local/bin/entrypoint.sh

# Define the entrypoint
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
