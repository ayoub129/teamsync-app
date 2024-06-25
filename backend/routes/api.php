<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChannelController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\DiscussionController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\FriendRequestController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\VideoChatController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {

    /* Routes for groups */
    Route::get('/groups', [GroupController::class, 'index']);
    Route::get('/user/groups', [GroupController::class, 'userGroups']);
    Route::post('/groups', [GroupController::class, 'store']);
    Route::get('/groups/{id}', [GroupController::class, 'show']);
    Route::post('/groups/{id}', [GroupController::class, 'update']);
    Route::delete('/groups/{id}', [GroupController::class, 'destroy']);
    Route::get('/groups/search/{name}', [GroupController::class, 'search']);
    Route::get('/groups/{groupId}/members', [GroupController::class, 'getMembers']);

    /* Friends Routes */
    Route::post('/send-friend-request', [FriendRequestController::class, 'sendRequest']);
    Route::post('/accept-friend-request/{id}', [FriendRequestController::class, 'acceptRequest']);
    Route::post('/friend-statuses', [FriendRequestController::class, 'getFriendStatuses']);
    Route::get('/friends', [FriendRequestController::class, 'getFriends']);
    Route::get('/friend-requests', [FriendRequestController::class, 'getFriendRequests']);
    Route::get('/friends-groups', [FriendRequestController::class, 'getFriendsAndGroups']);

    /* Routes for channels */
    Route::get('/channels', [ChannelController::class, 'index']);
    Route::post('/channels', [ChannelController::class, 'store']);
    Route::get('/channels/{id}', [ChannelController::class, 'show']);
    Route::post('/channels/{id}', [ChannelController::class, 'update']);
    Route::delete('/channels/{id}', [ChannelController::class, 'destroy']);
    Route::get('/channels/search/{name}', [ChannelController::class, 'search']);
    Route::post('/channels/{channelId}/join', [ChannelController::class, 'join']);
    Route::post('/channels/{channelId}/leave', [ChannelController::class, 'leave']);
    Route::get('/channels/{channelId}/members', [ChannelController::class, 'getChannelMembers']);
    Route::get('/popular/channels/', [ChannelController::class, 'getPopularChannels']);

    /* Routes for discussions */
    Route::get('/discussions', [DiscussionController::class, 'index']);
    Route::get('/discussions/{id}', [DiscussionController::class, 'getDiscussion']);
    Route::post('/discussions', [DiscussionController::class, 'store']);
    Route::delete('/discussions/{id}', [DiscussionController::class, 'destroy']);
    Route::get('/discussions/filter', [DiscussionController::class, 'filter']);
    Route::get('/groups/{groupId}/discussions', [DiscussionController::class, 'getGroupDiscussions']);
    Route::get('/channels/{channelId}/discussions', [DiscussionController::class, 'getChannelDiscussions']);
    Route::get('/discussion/search/{name}', [DiscussionController::class, 'search']);

    /* Routes for comments */
    Route::get('/discussions/{discussionId}/comments', [CommentController::class, 'index']);
    Route::post('/discussions/{discussionId}/comments', [CommentController::class, 'store']);
    Route::post('/comments/{id}/reply', [CommentController::class, 'reply']);
    Route::delete('/comments/{id}', [CommentController::class, 'destroy']);

    /* Routes for messages */
    Route::post('/messages', [MessageController::class, 'sendMessage']);
    Route::get('/messages', [MessageController::class, 'getMessages']);

    /* Routes for files */
    Route::post('/files/upload', [FileController::class, 'upload']);
    Route::get('/files/{file_id}', [FileController::class, 'download']);

    /* Routes for video chat */
    Route::post('/video-chat', [VideoChatController::class, 'createVideoChat']);

    /* Routes for authentication */
    Route::post('/reset-password', [AuthController::class, 'updatePassword']);
    Route::get('/users/{id}', [AuthController::class, 'show']);
    Route::post('/users/{id}', [AuthController::class, 'update']);
    Route::get('/users/{id}/image', [AuthController::class, 'getUserImage']);
});

// Routes for authentication
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
