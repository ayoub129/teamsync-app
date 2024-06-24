<?php 

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function sendMessage(Request $request)
    {
        $message = new Message([
            'user_id' => auth()->id(),
            'receiver_id' => $request->receiver_id,
            'group_id' => $request->group_id,
            'message' => $request->message,
        ]);
    
        broadcast(new MessageSent($message));
    
        $message->save();
    
        return response()->json(['status' => 'Message Sent!']);
    }

    public function sendGroupMessage(Request $request)
    {
        $message = Message::create([
            'user_id' => $request->user()->id,
            'group_id' => $request->input('group_id'),
            'message' => $request->input('message')
        ]);

        $channel = 'group-chat.' . $request->input('group_id');
        broadcast(new MessageSent($message, $channel))->toOthers();

        return response()->json(['status' => 'Message Sent!', 'message' => $message]);
    }


    public function getMessages(Request $request , $receiverId)
    {
        $userId = $request->user()->id;

        $messages = Message::where(function($query) use ($userId, $receiverId) {
            $query->where('user_id', $userId)
                  ->where('receiver_id', $receiverId);
        })->orWhere(function($query) use ($userId, $receiverId) {
            $query->where('user_id', $receiverId)
                  ->where('receiver_id', $userId);
        })->get();

        return response()->json($messages);
    }

    public function getGroupMessages(Request $request , $groupId)
    {
        $messages = Message::where('group_id', $groupId)->get();

        return response()->json($messages);
    }

}
