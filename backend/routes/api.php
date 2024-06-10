<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChannelController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\DiscussionController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\FriendRequestController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\PusherController;
use App\Http\Controllers\VideoChatController;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Route;

Broadcast::routes(['middleware' => ['auth:sanctum']]);

Route::middleware('auth:sanctum')->group(function () {
    
    /* Routes for groups */ 
    // Get all Groups 
    Route::get('/groups', [GroupController::class , 'index']);
    
    // Get the group of a specific user 
    Route::get('/user/groups', [GroupController::class, 'userGroups']);
    
    // Create a new Group
    Route::post('/groups', [GroupController::class , 'store']);
    
    // get a specific Group
    Route::get('/groups/{id}', [GroupController::class , 'show']);
    
    // update a Group
    Route::post('/groups/{id}', [GroupController::class , 'update']);

    // delete a Group
    Route::delete('/groups/{id}', [GroupController::class , 'destroy']);

    // search for a Group
    Route::get('/groups/search/{name}', [GroupController::class , 'search']);

    // get members from a Group
    Route::get('/groups/{groupId}/members', [GroupController::class , 'getMembers']);


    /* friends Routes */
    // send a friends request 
    Route::post('/send-friend-request', [FriendRequestController::class, 'sendRequest']);

    // accept the friend request
    Route::post('/accept-friend-request/{id}', [FriendRequestController::class, 'acceptRequest']);

    Route::post('/friend-statuses', [FriendRequestController::class, 'getFriendStatuses']);

    // get all friends
    Route::get('/friends', [FriendRequestController::class, 'getFriends']);

    Route::get('/friend-requests', [FriendRequestController::class, 'getFriendRequests']);

    /* Routes for channels */ 
    // Get all channels 
    Route::get('/channels', [ChannelController::class , 'index']);

    // Create a new channels
    Route::post('/channels',  [ChannelController::class , 'store']);
    
    // get a specific channel
    Route::get('/channels/{id}', [ChannelController::class , 'show']);
    
    // update a channel
    Route::post('/channels/{id}',  [ChannelController::class , 'update']);

    // delete a channel
    Route::delete('/channels/{id}',  [ChannelController::class , 'destroy']);

    // search for a channel
    Route::get('/channels/search/{name}', [ChannelController::class , 'search']);

    // Route to join a channel
    Route::post('/channels/{channelId}/join', [ChannelController::class , 'join']);
    
    // Route to leave a channel
    Route::post('/channels/{channelId}/leave', [ChannelController::class , 'leave']);

    // get members from a channel
    Route::get('/channels/{channelId}/members', [ChannelController::class, 'getChannelMembers']);
    
    // popular channels 
    Route::get('/popular/channels/', [ChannelController::class, 'getPopularChannels']);

    
    /* Routes for discussions */ 
    // Get all discussions 
    Route::get('/discussions', [DiscussionController::class, 'index']);

    // get single discussion
    Route::get('/discussions/{id}', [DiscussionController::class, 'getDiscussion']);

    // create a new discussion
    Route::post('/discussions', [DiscussionController::class, 'store']);

    // delete a discussion
    Route::delete('/discussions/{id}', [DiscussionController::class, 'destroy']);

    // filter discussions
    Route::get('/discussions/filter', [DiscussionController::class, 'filter']);
    
    // get group discussion
    Route::get('/groups/{groupId}/discussions', [DiscussionController::class, 'getGroupDiscussions']);
    
    // get channel discussion
    Route::get('/channels/{channelId}/discussions', [DiscussionController::class, 'getChannelDiscussions']);

    // search for a discussion
    Route::get('/discussion/search/{name}', [DiscussionController::class , 'search']);
    
    
    /* Routes for comments */
    // get Comments
    Route::get('/discussions/{discussionId}/comments', [CommentController::class, 'index']);

    // Create a new Comment for a specific Discussion
    Route::post('/discussions/{discussionId}/comments', [CommentController::class, 'store']);

    // Reply to a Comment
    Route::post('/comments/{id}/reply', [CommentController::class, 'reply']);

    // Delete a Comment
    Route::delete('/comments/{id}', [CommentController::class, 'destroy']);


    // update password
    Route::post('/reset-password',  [AuthController::class , 'updatePassword']);

    // get a user 
    Route::get('/users/{id}',   [AuthController::class , 'show']);

    // update a user
    Route::post('/users/{id}', [AuthController::class , 'update']);

    // get user image
    Route::get('/users/{id}/image', [AuthController::class, 'getUserImage']);

    /* Routes for files */
    // upload files
    Route::post('/files/upload', [FileController::class , 'upload']);

    // download files
    Route::get('/files/{file_id}', [FileController::class , 'download']);

    Route::post('/video-chat', [VideoChatController::class, 'createVideoChat']);

    Route::post('/pusher/send', [PusherController::class, 'send']);

    Broadcast::channel('chat.{receiver_id}', function ($user, $receiver_id) {
        return (int) $user->id === (int) $receiver_id || User::whereHas('friends', function($query) use ($user, $receiver_id) {
            $query->where('friends.user_id', $user->id)
                  ->where('friends.friend_id', $receiver_id);
        })->exists();
    });
            
});

// Routes for authentication
Route::post('/register', [AuthController::class , 'register']);

Route::post('/login', [AuthController::class , 'login']);
