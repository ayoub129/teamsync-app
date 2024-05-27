<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use App\Mail\PasswordResetMail;
use App\Models\File;

class AuthController extends Controller
{
    // forgot password
    public function forgot(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Generate a temporary token or OTP (you can use any library or method for this)
        $token = $this->generateTemporaryToken();

        // Store the token in the database or cache
        $user->update(['password_reset_token' => $token]);

        // Send the temporary token or OTP to the user's email or phone number
        $this->sendTemporaryToken($user->email, $token);

        return response()->json(['message' => 'Temporary token sent to your email'], 200);
    }

    // Generate a temporary token (you can implement this according to your requirements)
    private function generateTemporaryToken()
    {
        return bin2hex(random_bytes(16)); // Example: Generate a random 16-character token
    }

    // Send the temporary token to the user's email or phone number
    private function sendTemporaryToken($email, $token)
    {
        // Send an email with the temporary token
        Mail::to($email)->send(new PasswordResetMail($token));
    }

    // update Password Route 
    public function updatePassword(Request $request)
    {
        $request->validate([
            'password' => 'required|confirmed|min:8', // Assuming a minimum password length of 8 characters
        ]);
    
        $user = Auth::user();
    
        if (!$user) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }
    
        // Update the user's password
        $user->update([
            'password' => bcrypt($request->password), // Hash the new password
        ]);
    
        return response()->json(['message' => 'Password updated successfully'], 200);
    }
    
    // Check if the token is valid and not expired
    private function isValidToken($user)
    {
        return $user->password_reset_token_created_at->addHour()->gt(now());
    }

    // register a new user
    public function register(Request $request)
    {
        // Validate input
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users|max:255',
            'password' => 'required|confirmed|string|min:8',
        ]);
    
        // now create user in application database
        $user = User::create([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'password' => Hash::make($request->input('password')),
        ]);
    
        // Generate authentication token
        $token = $user->createToken('auth_token')->plainTextToken;
    
        // Return response
        return response()->json(['user' => $user, 'token' => $token], 201);
    }
    
    public function update(Request $request, $id)
    {
        // Find the user by ID
        $user = User::findOrFail($id);

        // Validate input
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $id,
            'file' => 'sometimes|file|mimes:jpeg,png,jpg,gif,svg',
            'friends' => 'array',
        ]);

        // Update user's information if provided
        if ($request->has('name')) {
            $user->name = $request->input('name');
        }

        if ($request->has('email')) {
            $user->email = $request->input('email');
        }

        // Save the updated user
        $user->save();

        if ($request->has('friends')) {
            $user->users()->sync($request->input('friends'));
        }

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $path = $file->store('uploads', 'public');

            // Create a new file record
            $fileRecord = new File([
                'name' => $file->getClientOriginalName(),
                'path' => $path,
                'size' => $file->getSize(),
                'mime_type' => $file->getClientMimeType(),
                'user_id' => $user->id,
            ]);

            $user->files()->save($fileRecord);
        }

        // Return success response
        return response()->json(['message' => 'User updated successfully', 'user' => $user], 200);
    }

    public function getUserImage($id)
    {
        $user = User::findOrFail($id);

        if ($user->files()->exists()) {
            $file = $user->files()->latest()->first();
            $imageUrl = asset('storage/' . $file->path);
        } else {
            return response()->json(['error' => 'Image Not Found'], 400);
        }

        return response()->json(['image' => $imageUrl], 200);
    }

    // get a specific user
    public function show($id)
    {
        // Find the user by ID
        $user = User::withCount(['channels', 'groups', 'friends', 'discussions'])->findOrFail($id);

        // Check if user is found
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Return the user data
        return response()->json(['user' => $user], 200);
    }

    // login a user with password
    public function login(Request $request)
    {
        // Validate request data
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        // Attempt to authenticate the user
        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            // Authentication successful
            $user = Auth::user();
            $token = $user->createToken('AuthToken')->plainTextToken;
            
            return response()->json(['user' => $user, 'token' => $token], 200);
        } else {
            // Authentication failed
            return response()->json(['message' => 'Invalid credentials'], 401);
        }
    }
}