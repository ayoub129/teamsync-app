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

        $sender = Auth::user();
        $receiver = User::find($request->receiver_id);

        // Check if the sender or receiver is an admin
        if ($sender->isAdmin() || $receiver->isAdmin()) {
            return response()->json(['message' => 'Admins cannot send or receive friend requests'], 403);
        }

        $friendRequest = FriendRequest::create([
            'sender_id' => $sender->id,
            'receiver_id' => $receiver->id,
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

    public function getFriendsAndGroups(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        if ($user->isAdmin()) {
            $friends = User::where('id', '!=', $user->id)->get();
        } else {
            $friends = $user->friends;
        }

        $groups = $user->groups; // Assuming there's a groups relationship on the User model

        return response()->json([
            'friends' => $friends,
            'groups' => $groups
        ], 200);
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
                $user = User::find($memberId);

                // Check if the member or the current user is an admin
                if ($user->isAdmin() || Auth::user()->isAdmin()) {
                    $statuses[$memberId] = 'friends';
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
        }

        return response()->json(['statuses' => $statuses], 200);
    }
}
