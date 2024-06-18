<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\File;

class AuthController extends Controller
{
    // Update Password Route
    public function updatePassword(Request $request)
    {
        $request->validate([
            'password' => 'required|confirmed|min:8',
        ]);

        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        // Update the user's password in the local database
        $user->update([
            'password' => bcrypt($request->password),
        ]);

        return response()->json(['message' => 'Password updated successfully'], 200);
    }

    // Register a new user
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users|max:255',
            'password' => 'required|confirmed|string|min:8',
        ]);

        // Create user in local database
        $user = User::create([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'password' => Hash::make($request->input('password')),
        ]);

        // Generate authentication token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json(['user' => $user, 'token' => $token], 201);
    }

    // Update user details
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $id,
            'file' => 'sometimes|file|mimes:jpeg,png,jpg,gif,svg|max:5120',
            'friends' => 'array',
        ]);

        if ($request->has('name')) {
            $user->name = $request->input('name');
        }

        if ($request->has('email')) {
            $user->email = $request->input('email');
        }

        $user->save();

        if ($request->has('friends')) {
            $user->users()->sync($request->input('friends'));
        }

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $path = $file->store('uploads', 'public');

            $fileRecord = new File([
                'name' => $file->getClientOriginalName(),
                'path' => $path,
                'size' => $file->getSize(),
                'mime_type' => $file->getClientMimeType(),
                'user_id' => $user->id,
            ]);

            $user->files()->save($fileRecord);
        }

        return response()->json(['message' => 'User updated successfully', 'user' => $user], 200);
    }

    // Get user image
    public function getUserImage($id)
    {
        $user = User::findOrFail($id);

        if ($user->files()->exists()) {
            $file = $user->files()->latest()->first();
            $imageUrl = asset('storage/' . $file->path);
        } else {
            return response()->json(['error' => 'Image Not Found'], 202);
        }

        return response()->json(['image' => $imageUrl], 200);
    }

    // Get a specific user
    public function show($id)
    {
        $user = User::withCount(['channels', 'groups', 'friends', 'discussions'])->findOrFail($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json(['user' => $user], 200);
    }

    // Login a user
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $user = Auth::user();
        $token = $user->createToken('AuthToken')->plainTextToken;

        return response()->json(['user' => $user, 'token' => $token], 200);
    }
}
