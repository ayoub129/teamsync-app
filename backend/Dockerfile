# Stage 1: PHP and Apache setup
FROM php:8.2-apache AS php

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libldap2-dev \
    git \
    zip \
    unzip \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-configure ldap --with-libdir=lib/x86_64-linux-gnu \
    && docker-php-ext-install ldap \
    && docker-php-ext-install pdo pdo_mysql

# Install Composer
RUN curl -L https://getcomposer.org/installer -o composer-setup.php \
    && php composer-setup.php --install-dir=/usr/local/bin --filename=composer \
    && rm composer-setup.php

# Set working directory
WORKDIR /var/www

# Copy application files
COPY . /var/www

# Copy entrypoint script and set permissions
COPY Docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Set the entry point for the container
ENTRYPOINT [ "/usr/local/bin/entrypoint.sh" ]

# Expose the port for Apache
EXPOSE 8000
