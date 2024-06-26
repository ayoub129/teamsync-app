<?php 

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function index($id)
    {
        $userId = auth()->id();
        $message = Message::where(function ($query) use ($userId, $id) {
                                $query->where('user_id', $userId)
                                      ->where('receiver_id', $id);
                            })
                            ->orWhere(function ($query) use ($userId, $id) {
                                $query->where('user_id', $id)
                                      ->where('receiver_id', $userId);
                            })
                            ->orWhere('group_id', $id)
                            ->orderBy('created_at', 'asc')
                            ->get();

        return response()->json(['message' => $message]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'receiver_id' => 'nullable|exists:users,id',
            'group_id' => 'nullable|exists:groups,id',
            'message' => 'required|string',
        ]);

        $message = Message::create([
            'user_id' => auth()->id(),
            'receiver_id' => $request->receiver_id,
            'group_id' => $request->group_id,
            'message' => $request->message,
        ]);

        broadcast(new MessageSent($message))->toOthers();

        return response()->json(['message' => $message], 201);
    }
}
