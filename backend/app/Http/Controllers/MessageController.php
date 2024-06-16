<?php 

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Events\MessageSent;

class MessageController extends Controller
{
    public function index($receiver_id)
    {
        $user_id = Auth::id();
        $messages = Message::where(function ($query) use ($user_id, $receiver_id) {
            $query->where('sender_id', $user_id)
                  ->where('receiver_id', $receiver_id);
        })->orWhere(function ($query) use ($user_id, $receiver_id) {
            $query->where('sender_id', $receiver_id)
                  ->where('receiver_id', $user_id);
        })->get();

        return response()->json(['messages' => $messages]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'message' => 'required|string',
        ]);

        $message = Message::create([
            'sender_id' => Auth::id(),
            'receiver_id' => $request->receiver_id,
            'message' => $request->message,
        ]);

        broadcast(new MessageSent($message))->toOthers();

        return response()->json(['message' => $message]);
    }
}
