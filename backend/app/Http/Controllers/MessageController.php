<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MessageController extends Controller
{
    public function index()
    {
        return Message::with(['sender', 'receiver'])->get();
    }

    public function store(Request $request)
    {
        $message = DB::transaction(function () use ($request) {
            $message = Message::create($request->all());
            event(new \App\Events\MessageSent($message));
            return $message;
        });

        return response()->json($message, 201);
    }
}
