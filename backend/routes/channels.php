<?php

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Auth;

Broadcast::channel('chat.{receiver_id}', function ($user, $receiver_id) {
    return Auth::check();
});