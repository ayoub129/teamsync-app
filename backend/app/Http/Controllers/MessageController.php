<?php 

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function sendMessage(Request $request)
    {
        $message = Message::create([
            'user_id' => $request->user()->id,
            'receiver_id' => $request->input('receiver_id'),
            'message' => $request->input('message')
        ]);

        broadcast(new MessageSent($message))->toOthers();

        return response()->json(['status' => 'Message Sent!', 'message' => $message]);
    }

    public function sendGroupMessage(Request $request)
    {
        $message = Message::create([
            'user_id' => $request->user()->id,
            'group_id' => $request->input('group_id'),
            'message' => $request->input('message')
        ]);

        broadcast(new MessageSent($message))->toOthers();

        return response()->json(['status' => 'Message Sent!', 'message' => $message]);
    }

    public function getMessages(Request $request)
    {
        $userId = $request->user()->id;
        $receiverId = $request->input('receiver_id');

        $messages = Message::where(function($query) use ($userId, $receiverId) {
            $query->where('user_id', $userId)
                  ->where('receiver_id', $receiverId);
        })->orWhere(function($query) use ($userId, $receiverId) {
            $query->where('user_id', $receiverId)
                  ->where('receiver_id', $userId);
        })->get();

        return response()->json($messages);
    }

    public function getGroupMessages(Request $request)
    {
        $groupId = $request->input('group_id');

        $messages = Message::where('group_id', $groupId)->get();

        return response()->json($messages);
    }
}
