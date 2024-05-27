<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Discussion;
use App\Models\File;
use Illuminate\Support\Facades\Auth;

class DiscussionController extends Controller
{
    // Get all discussions
    public function index()
    {
        // Get discussions with pagination
        $discussions = Discussion::paginate(10); 
    
        // Return JSON response with paginated discussions
        return response()->json(['discussions' => $discussions], 200);
    }

    public function getDiscussion($id)
    {
        $discussion = Discussion::with(['user', 'files'])->findOrFail($id);
        return response()->json(['discussion' => $discussion], 200);
    }


    // Search for a discussion by name
    public function search($name)
    {
        // Perform a case-insensitive search for channels with names containing the provided name
        $discussion = Discussion::where('title', 'like', '%' . $name . '%')->get();
    
        // Check if any channels are found
        if ($discussion->isEmpty()) {
            return response()->json(['message' => 'No channels found matching the search criteria'], 404);
        }
    
        // Return JSON response with the found channels
        return response()->json(['discussion' => $discussion], 200);
    }
    

    // filter the discussion
    public function filter(Request $request)
    {
        $filter = $request->input('filter');
    
        $query = Discussion::query();
    
        switch ($filter) {
            case 'Latest':
                $query->orderBy('created_at', 'desc');
                break;
            
            case 'Solved':
                $query->where('solved', true);
                break;
    
            case 'Unsolved':
                $query->where('solved', false);
                break;
    
            case 'No Replies Yet':
                $query->whereDoesntHave('comments');
                break;
    
            default:
                return response()->json(['message' => 'Invalid filter'], 400);
        }
    
        // Paginate the results
        $discussions = $query->paginate(10);
    
        // Return the filtered discussions
        return response()->json(['discussions' => $discussions], 200);
    }
            
    // Create a new discussion
    public function store(Request $request)
    {
        // Validate input
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'group_id' => 'nullable|exists:groups,id',
            'channel_id' => 'nullable|exists:channels,id',
            'file' => 'nullable|file|max:10240', // Validate file input (max 10MB)
        ]);
    
        // Create the discussion
        $discussion = Discussion::create([
            'title' => $request->title,
            'content' => $request->content,
            'group_id' => $request->group_id,
            'channel_id' => $request->channel_id,
            'user_id' => Auth::id(),
        ]);
    
        // Handle file upload
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $filePath = $file->store('uploads', 'public');
            $fileModel = File::create([
                'name' => $file->getClientOriginalName(),
                'path' => $filePath,
                'size' => $file->getSize(),
                'mime_type' => $file->getMimeType(),
                'discussion_id' => $discussion->id,
                'user_id' => Auth::id(),
            ]);
        }
    
        // Return success response with the created discussion
        return response()->json(['message' => 'Discussion created successfully', 'discussion' => $discussion], 201);
    }
    
        // delete a discussion
        public function destroy($id)
        {
            // Find the discussion by ID
            $discussion = Discussion::find($id);

            // Check if the discussion exists
            if (!$discussion) {
                return response()->json(['message' => 'Discussion not found'], 404);
            }

            // Check if the authenticated user is the creator of the discussion
            if ($discussion->user_id !== Auth::id()) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $discussion->delete();

            // Return success response
            return response()->json(['message' => 'discussion deleted successfully'], 200);
        }
    
        // Get discussions for a specific group
        public function getGroupDiscussions($groupId)
        {
            // Fetch discussions associated with the group and paginate the results
            $discussions = Discussion::where('group_id', $groupId)->paginate(10);

            // Return paginated discussions for the group
            return response()->json(['discussions' => $discussions], 200);
        }

        // Get discussions for a specific channel
        public function getChannelDiscussions($channelId)
        {
            // Fetch discussions associated with the channel and paginate the results
            $discussions = Discussion::where('channel_id', $channelId)->paginate(10);

            // Return paginated discussions for the channel
            return response()->json(['discussions' => $discussions], 200);
        }        
}
