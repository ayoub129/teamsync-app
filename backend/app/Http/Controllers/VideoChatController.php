<?php 
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\VideoChatRoom;
use App\Models\Notification;
use App\Models\User;
use Pusher\Pusher;

class VideoChatController extends Controller
{
    public function createVideoChat(Request $request)
    {
        $request->validate([
            'channel_id' => 'required|integer',
            'channel_name' => 'required|string',
        ]);

        $user = $request->user();

        if (!$user->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $videoChatRoom = VideoChatRoom::create([
            'channel_id' => $request->channel_id,
            'channel_name' => $request->channel_name,
            'created_by' => $user->id,
        ]);

        return response()->json(['message' => 'Video chat room created successfully', 'room' => $videoChatRoom->id], 201);
    }

    private function sendNotification($videoChatRoom)
    {
        $pusher = new Pusher(
            env('PUSHER_APP_KEY'),
            env('PUSHER_APP_SECRET'),
            env('PUSHER_APP_ID'),
            [
                'cluster' => env('PUSHER_APP_CLUSTER'),
                'useTLS' => true
            ]
        );

        $channelMembers = User::whereHas('channels', function ($query) use ($videoChatRoom) {
            $query->where('channel_id', $videoChatRoom->channel_id);
        })->get();

        foreach ($channelMembers as $member) {
            Notification::create([
                'user_id' => $member->id,
                'message' => 'A new video chat room has been created.',
            ]);

            $pusher->trigger('notifications', 'new-notification', [
                'message' => 'A new video chat room has been created: ' . $videoChatRoom->channel_id,
                'room' => $videoChatRoom,
            ]);
        }
    }
}
