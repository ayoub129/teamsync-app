FROM php:8.2-apache as php

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
    
ENV PORT=8000
ENTRYPOINT [ "Docker/entrypoint.sh" ]