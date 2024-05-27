<?php

namespace App\Http\Controllers;

use App\Models\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request; 

class FileController extends Controller
{
    /**
     * Upload a file.
     */
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|file',
            'related_id' => 'required|integer',
            'related_type' => 'required|string|in:discussion,message',
        ]);

        // Store the file
        $path = $request->file('file')->store('files');

        // Create the file record in the database
        $file = new File();
        $file->name = $request->file('file')->getClientOriginalName();
        $file->path = $path;
        $file->size = $request->file('file')->getSize();
        $file->mime_type = $request->file('file')->getMimeType();
        $file->discussion_id = $request->related_type === 'discussion' ? $request->related_id : null;
        $file->message_id = $request->related_type === 'message' ? $request->related_id : null;
        $file->user_id = auth()->id();
        $file->save();

        return response()->json(['message' => 'File uploaded successfully', 'file' => $file], 201);
    }

    /**
     * Download a file.
     */
    public function download($file_id)
    {
        $file = File::find($file_id);

        if (!$file) {
            return response()->json(['message' => 'File not found'], 404);
        }

        return Storage::download($file->path, $file->name);
    }
}
