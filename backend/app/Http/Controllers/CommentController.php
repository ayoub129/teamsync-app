<?php 

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comment;
use App\Models\File;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller 
{
    /**
     * Get comments of a specific discussion.
     */
    public function index($discussionId)
    {
        $comments = Comment::with(['user', 'files'])->where('discussion_id', $discussionId)->orderBy('created_at', 'asc')->get();
        return response()->json(['comments' => $comments], 200);
    }

    /**
     * Create a new comment for a specific discussion.
     */
    public function store(Request $request, $discussionId)
    {
        $request->validate([
            'content' => 'required|string|max:255',
            'file' => 'nullable|file|max:10240', // Validate file input (max 10MB)
        ]);

        // Create the comment
        $comment = new Comment();
        $comment->user_id = Auth::id();
        $comment->discussion_id = $discussionId;
        $comment->content = $request->content;
        $comment->save();

        // Handle file upload
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $filePath = $file->store('uploads', 'public');
            File::create([
                'name' => $file->getClientOriginalName(),
                'path' => $filePath,
                'size' => $file->getSize(),
                'mime_type' => $file->getMimeType(),
                'comment_id' => $comment->id,
                'user_id' => Auth::id(),
            ]);
        }


        return response()->json(['message' => 'Comment created successfully', 'comment' => $comment], 201);
    }

    /**
     * Delete a comment.
     */
    public function destroy($id)
    {
        $comment = Comment::find($id);
        
        // Check if the comment exists
        if (!$comment) {
            return response()->json(['message' => 'Comment not found'], 404);
        }

        // Check if the authenticated user is the owner of the comment or is an admin
        if ($comment->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $comment->delete();
        return response()->json(['message' => 'Comment deleted successfully'], 200);
    }

    /**
     * Reply to a comment.
     */
    public function reply(Request $request, $id)
    {
        $request->validate([
            'content' => 'required|string|max:255',
        ]);

        $parentComment = Comment::find($id);
        
        // Check if the parent comment exists
        if (!$parentComment) {
            return response()->json(['message' => 'Parent comment not found'], 404);
        }

        // Create the reply
        $reply = new Comment();
        $reply->user_id = Auth::id();
        $reply->discussion_id = $parentComment->discussion_id;
        $reply->parent_id = $id; 
        $reply->content = $request->content;
        $reply->save();

        return response()->json(['message' => 'Reply added successfully', 'reply' => $reply], 201);
    }

}
