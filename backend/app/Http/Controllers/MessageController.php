<?php 

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
    // Send a message
    public function sendMessage(Request $request)
    {
        $request->validate([
            'message' => 'required|string',
            'receiver_id' => 'nullable|exists:users,id',
            'group_id' => 'nullable|exists:groups,id',
        ]);

        $message = Message::create([
            'user_id' => Auth::id(),
            'receiver_id' => $request->receiver_id,
            'group_id' => $request->group_id,
            'message' => $request->message,
        ]);

        $channel = $request->group_id ? 'group-chat.' . $request->group_id : 'private-chat.' . $request->receiver_id;
        broadcast(new MessageSent($message, $channel))->toOthers();

        return response()->json(['message' => 'Message sent successfully', 'message' => $message], 201);
    }

    // Get messages
    public function getMessages(Request $request)
    {
        $request->validate([
            'receiver_id' => 'nullable|exists:users,id',
            'group_id' => 'nullable|exists:groups,id',
        ]);

        $query = Message::query();

        if ($request->filled('receiver_id')) {
            $query->where(function ($query) use ($request) {
                $query->where('user_id', Auth::id())
                    ->where('receiver_id', $request->receiver_id);
            })->orWhere(function ($query) use ($request) {
                $query->where('user_id', $request->receiver_id)
                    ->where('receiver_id', Auth::id());
            });
        }

        if ($request->filled('group_id')) {
            $query->where('group_id', $request->group_id);
        }

        $messages = $query->get();

        return response()->json(['messages' => $messages], 200);
    }
}
