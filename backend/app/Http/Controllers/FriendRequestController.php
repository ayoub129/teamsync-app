<?php 

namespace App\Http\Controllers;

use App\Models\FriendRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FriendRequestController extends Controller
{
    public function sendRequest(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
        ]);
    
        $friendRequest = FriendRequest::create([
            'sender_id' => Auth::id(),
            'receiver_id' => $request->receiver_id,
        ]);
    
        return response()->json(['message' => 'Friend request sent successfully', 'friend_request' => $friendRequest], 200);
    }

    public function getFriendRequests()
    {
        $userId = Auth::id();
        $friendRequests = FriendRequest::where('receiver_id', $userId)
                                    ->where('status', 'pending')
                                    ->with('sender') // Assuming you have a 'sender' relationship defined in FriendRequest model
                                    ->get();

        return response()->json(['friend_requests' => $friendRequests], 200);
    }

    
    public function acceptRequest($id)
    {
        $friendRequest = FriendRequest::where('receiver_id', Auth::id())->where('id', $id)->firstOrFail();
        $friendRequest->status = 'accepted';
        $friendRequest->save();
    
        // Create a friendship
        Auth::user()->friends()->attach($friendRequest->sender_id);
        User::find($friendRequest->sender_id)->friends()->attach(Auth::id());
    
        return response()->json(['message' => 'Friend request accepted successfully'], 200);
    }
    
    public function getFriends(Request $request)
    {
        $user = Auth::user();
        
        if ($user->isAdmin()) {
            $users = User::where('id', '!=', $user->id)->get();
            return response()->json(['friends' => $users], 200);
        } else {
            $friends = $user->friends;
            return response()->json(['friends' => $friends], 200);
        }
    }

    public function getFriendStatuses(Request $request)
    {
        $userId = Auth::id();
        $members = $request->input('members', []); // Expecting an array of member IDs

        $statuses = [];

        foreach ($members as $memberId) {
            if ($userId == $memberId) {
                $statuses[$memberId] = 'self';
            } else {
                $friendRequest = FriendRequest::where(function ($query) use ($userId, $memberId) {
                    $query->where('sender_id', $userId)->where('receiver_id', $memberId);
                })->orWhere(function ($query) use ($userId, $memberId) {
                    $query->where('sender_id', $memberId)->where('receiver_id', $userId);
                })->first();

                if ($friendRequest) {
                    if ($friendRequest->status == 'accepted') {
                        $statuses[$memberId] = 'friends';
                    } elseif ($friendRequest->sender_id == $userId) {
                        $statuses[$memberId] = 'request_sent';
                    } else {
                        $statuses[$memberId] = 'request_received';
                    }
                } else {
                    $statuses[$memberId] = 'not_friends';
                }
            }
        }

        return response()->json(['statuses' => $statuses], 200);
    }
}
