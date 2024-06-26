<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Group;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class GroupController extends Controller
{
    // Get all Groups
    public function index()
    {
        $groups = Group::all();
        return response()->json(['groups' => $groups], 200);
    }

    public function userGroups()
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        $groups = $user->groups;

        return response()->json(['groups' => $groups], 200);
    }


    // Create a new group
    public function store(Request $request)
    {
        $userId = Auth::id();
    
        $request->validate([
            'name' => 'required|string|unique:groups',
            'description' => 'required|string',
            'members' => 'required|array',
            'members.*' => 'exists:users,id',
            'image' => 'nullable|image|max:2048',
        ]);
    
        // Handle image upload
        $imagePath = $request->file('image') ? $request->file('image')->store('group_images', 'public') : null;
    
        // Get the members array from the request
        $members = $request->input('members', []);
    
        // Ensure the current user is included in the members array
        if (!in_array($userId, $members)) {
            $members[] = $userId;
        }
    
        // Create a new group
        $group = Group::create([
            'name' => $request->name,
            'description' => $request->description,
            'user_id' => $userId,
            'image' => $imagePath,
        ]);
    
        // Attach the members to the group
        $group->users()->attach($members);
    
        // Return a success response
        return response()->json(['message' => 'Group created successfully', 'group' => $group], 201);
    }
    
    // Get a specific Group
    public function show($id)
    {
        $group = Group::with('users')->findOrFail($id);
        return response()->json(['group' => $group], 200);
        }

    // Update a specific Group
    public function update(Request $request, $id)
    {
        $group = Group::findOrFail($id);

        if ($group->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'name' => 'string|unique:groups,name,' . $id,
            'description' => 'string',
            'members' => 'array',
            'members.*' => 'exists:users,id',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($request->has('name')) {
            $group->name = $request->input('name');
        }

        if ($request->has('description')) {
            $group->description = $request->input('description');
        }

        if ($request->hasFile('image')) {
            if ($group->image) {
                Storage::disk('public')->delete($group->image);
            }
            $group->image = $request->file('image')->store('group_images', 'public');
        }

        $group->save();

        if ($request->has('members')) {
            $group->users()->sync($request->input('members'));
        }

        return response()->json(['message' => 'Group updated successfully', 'group' => $group], 200);
    }


    public function destroy($id)
    {
        $group = Group::findOrFail($id);

        if ($group->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $group->delete();

        return response()->json(['message' => 'Group deleted successfully'], 200);
    }


    public function search($name)
    {
        $groups = Group::where('name', 'like', "%$name%")->get();
        return response()->json(['groups' => $groups], 200);
    }

    public function getMembers($groupId)
    {
        $group = Group::findOrFail($groupId);
    
        $members = $group->users()->get()->map(function ($user) {
            $image = $user->files()->latest()->first();
            return [
                'id' => $user->id,
                'name' => $user->name,
                'image' => $image ? asset('storage/' . $image->path) : null,
            ];
        });
    
        return response()->json(['members' => $members], 200);
    }
}