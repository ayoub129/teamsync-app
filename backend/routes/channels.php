<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('private-chat.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('group-chat.{id}', function ($user, $id) {
    return true; // Adjust the logic based on your requirements
});
