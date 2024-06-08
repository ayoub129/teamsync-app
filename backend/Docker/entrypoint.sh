#!/bin/bash

composer dump-autoload

if [ ! -f "vendor/autoload.php" ]; then
    composer install --no-progress --no-interaction
fi


if [ ! -f ".env" ]; then
    echo "Creating env file for env $APP_ENV"
    cp .env.example .env
else
    echo "env file exists."
fi

php artisan migrate
php artisan cache:clear
php artisan config:clear
php artisan key:generate
php artisan storage:link
chmod -R 775 storage
chown -R www-data:www-data storage
php artisan serve --port=$PORT --host=0.0.0.0 --env=.env
exec docker-php-entrypoint "$@"
