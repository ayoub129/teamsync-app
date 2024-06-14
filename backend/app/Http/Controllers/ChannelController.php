<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Channel;
use Illuminate\Support\Facades\Auth;

class ChannelController extends Controller
{
    public function index(Request $request)
    {
        // Get the page number from the request, default to 1
        $page = $request->input('page', 1);

        // Determine the number of items to skip
        $skip = ($page - 1) * 20;

        // Get the authenticated user
        $user = Auth::user();

        // Fetch public channels
        $publicChannels = Channel::where('status', 'public')->withCount('discussions')->get();

        // Fetch private channels where the user is a member of the associated group
        $privateChannels = Channel::where('status', 'private')
            ->whereHas('groups.users', function ($query) use ($user) {
                $query->where('users.id', $user->id);
            })
            ->withCount('discussions')
            ->get();

        // Combine the public and private channels
        $channels = $publicChannels->merge($privateChannels)->sortByDesc('discussions_count')->skip($skip)->take(20);

        // Get the total count of combined channels
        $totalChannels = $publicChannels->count() + $privateChannels->count();

        // Calculate the total number of pages
        $totalPages = ceil($totalChannels / 20);

        // Return JSON response with the channels, total channels, and total pages
        return response()->json(['channels' => $channels->values(), 'totalPages' => $totalPages], 200);
    }

    // Get the most popular channels based on the number of discussions
    public function getPopularChannels()
    {
        // Get the authenticated user
        $user = Auth::user();

        // Fetch public channels
        $publicChannels = Channel::withCount('discussions')->where('status', 'public')->get();

        // Fetch private channels where the user is a member of the associated group
        $privateChannels = Channel::withCount('discussions')
            ->where('status', 'private')
            ->whereHas('groups.users', function ($query) use ($user) {
                $query->where('users.id', $user->id);
            })
            ->get();

        // Combine the public and private channels and order by discussion count
        $popularChannels = $publicChannels->merge($privateChannels)->sortByDesc('discussions_count')->take(9);

        // Return JSON response with the popular channels
        return response()->json(['popularChannels' => $popularChannels->values()], 200);
    }

    // Create a new channel
    public function store(Request $request)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Only admins can create channels'], 403);
        }
    
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|string|in:public,private',
            'groups' => 'nullable|array',
            'groups.*' => 'exists:groups,id',
        ]);

        $channel = Channel::create([
            'name' => $request->input('name'),
            'description' => $request->input('description'),
            'status' => $request->input('status'),
        ]);

        // Add the admin who created the channel to the members
        $admin = $request->user();
        $channel->users()->attach($admin->id);

        if ($request->filled('groups')) {
            $channel->groups()->sync($request->input('groups'));
        }

        return response()->json(['channel' => $channel], 201);
    }
    
    // Define the controller method
    public function getChannelMembers($channelId)
    {
        $channel = Channel::find($channelId);
    
        if (!$channel) {
            return response()->json(['message' => 'Channel not found'], 404);
        }
    
        $members = $channel->users()->get()->map(function ($user) {
            $image = $user->files()->latest()->first();
            return [
                'id' => $user->id,
                'name' => $user->name,
                'image' => $image ? asset('storage/' . $image->path) : null,
            ];
        });
    
        return response()->json(['members' => $members], 200);
    }
    
    // Get a specific channel by ID
    public function show($id)
    {
        // Find the channel by ID
        $channel = Channel::findOrFail($id);

        // Check if the channel exists
        if (!$channel) {
            return response()->json(['message' => 'Channel not found'], 404);
        }

        // Return JSON response with the channel
        return response()->json(['channel' => $channel], 200);
    }

    // Update a channel
    public function update(Request $request, $id)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Only admins can update channels'], 403);
        }
    
        $request->validate([
            'name' => 'string|max:255|unique:channels,name,' . $id,
            'description' => 'string|max:255',
            'status' => 'string',
            'groups' => 'array',
            'groups.*' => 'exists:groups,id',
        ]);
    
        $channel = Channel::find($id);
    
        if (!$channel) {
            return response()->json(['message' => 'Channel not found'], 404);
        }
    
        if ($request->has('name')) {
            $channel->name = $request->input('name');
        }
    
        if ($request->has('description')) {
            $channel->description = $request->input('description');
        }
    
        if ($request->has('status')) {
            $channel->status = $request->input('status');
        }
    
        $channel->save();
    
        if ($request->status === 'private' && $request->has('groups')) {
            $channel->groups()->sync($request->groups);
        }
    
        return response()->json(['message' => 'Channel updated successfully', 'channel' => $channel], 200);
    }
    
    // Delete a channel
    public function destroy(Request $request, $id)
    {
        // Check if the authenticated user is an admin
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Only admins can delete channels'], 403);
        }

        // Find the channel by ID
        $channel = Channel::find($id);

        // Check if the channel exists
        if (!$channel) {
            return response()->json(['message' => 'Channel not found'], 404);
        }

        // Delete the channel
        $channel->delete();

        // Return success response
        return response()->json(['message' => 'Channel deleted successfully'], 200);
    }

    // Search for a channel by name
    public function search($name)
    {
        // Perform a case-insensitive search for channels with names containing the provided name
        $channels = Channel::where('name', 'like', '%' . $name . '%')->get();

        // Check if any channels are found
        if ($channels->isEmpty()) {
            return response()->json(['message' => 'No channels found matching the search criteria'], 404);
        }

        // Return JSON response with the found channels
        return response()->json(['channels' => $channels], 200);
    }

    // Join a channel
    public function join(Request $request, $channelId)
    {
        $user = $request->user();
        $channel = Channel::find($channelId);

        if (!$channel) {
            return response()->json(['message' => 'Channel not found'], 404);
        }

        if ($channel->users()->where('user_id', $user->id)->exists()) {
            return response()->json(['message' => 'User is already a member of the channel'], 400);
        }

        $channel->users()->attach($user->id);
        return response()->json(['message' => 'User joined the channel successfully'], 200);
    }

    // Leave a channel
    public function leave(Request $request, $channelId)
    {
        $user = $request->user();
        $channel = Channel::find($channelId);

        if (!$channel) {
            return response()->json(['message' => 'Channel not found'], 404);
        }

        if (!$channel->users()->where('user_id', $user->id)->exists()) {
            return response()->json(['message' => 'User is not a member of the channel'], 400);
        }

        // Prevent admin from leaving the channel
        if ($user->isAdmin()) {
            return response()->json(['message' => 'Admin cannot leave the channel'], 403);
        }

        $channel->users()->detach($user->id);
        return response()->json(['message' => 'User left the channel successfully'], 200);
    }
    
}
