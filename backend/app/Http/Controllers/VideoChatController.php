<?php 
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\VideoChatRoom;

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
}
