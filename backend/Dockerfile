# Stage 1: PHP and Apache setup
FROM php:8.2-apache AS php

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libldap2-dev \
    git \
    zip \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-configure ldap --with-libdir=lib/x86_64-linux-gnu \
    && docker-php-ext-install ldap \
    && docker-php-ext-install pdo pdo_mysql

# Install Composer
COPY --from=composer:2.3.5 /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy application files
COPY . .

# Install PHP dependencies
RUN composer install

# Set the entry point for the container
ENTRYPOINT [ "Docker/entrypoint.sh" ]

# Expose the port for Apache
EXPOSE 8000
