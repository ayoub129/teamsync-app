<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use LdapRecord\Models\ActiveDirectory\User as LdapUser;
use LdapRecord\Container;
use LdapRecord\Laravel\Auth\ListensForLdapBindFailure;
use LdapRecord\Laravel\Auth\AuthenticatesWithLdap;
use App\Models\User;
use App\Models\File;

class AuthController extends Controller
{
    use AuthenticatesWithLdap, ListensForLdapBindFailure;

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

        // Update the user's password in LDAP
        try {
            $ldapUser = LdapUser::where('mail', '=', $user->email)->firstOrFail();
            $ldapUser->unicodePwd = $this->encodePassword($request->password);
            $ldapUser->save();
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to update LDAP password', 'error' => $e->getMessage()], 500);
        }

        return response()->json(['message' => 'Password updated successfully'], 200);
    }

    private function encodePassword($password)
    {
        return iconv('UTF-8', 'UTF-16LE', '"' . $password . '"');
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

        // Create user in LDAP directory
        try {
            $ldapUser = (new LdapUser())->inside('ou=Users,dc=teamsync,dc=com');
            $ldapUser->cn = $request->input('name');
            $ldapUser->givenName = $request->input('name'); // Given name
            $ldapUser->sn = $request->input('name'); // Surname
            $ldapUser->mail = $request->input('email');
            $ldapUser->unicodePwd = $this->encodePassword($request->input('password'));
            $ldapUser->objectClass = ['inetOrgPerson', 'top']; // Specify object classes
            $ldapUser->save();
        } catch (\Exception $e) {
            // Rollback local user creation if LDAP user creation fails
            $user->delete();
            return response()->json(['message' => 'Failed to create LDAP user', 'error' => $e->getMessage()], 500);
        }

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

        $oldEmail = $user->email;

        if ($request->has('name')) {
            $user->name = $request->input('name');
        }

        if ($request->has('email')) {
            $user->email = $request->input('email');
        }

        $user->save();

        // Update user in LDAP
        try {
            $ldapUser = LdapUser::where('mail', '=', $oldEmail)->firstOrFail();

            if ($request->has('name')) {
                $ldapUser->cn = $request->input('name');
                $ldapUser->givenName = $request->input('name'); // Given name
                $ldapUser->sn = $request->input('name'); // Surname
            }

            if ($request->has('email')) {
                $ldapUser->mail = $request->input('email');
            }

            $ldapUser->save();
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to update LDAP user', 'error' => $e->getMessage()], 500);
        }

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
            return response()->json(['error' => 'Image Not Found'], 400);
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

    // Login a user with LDAP authentication
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        try {
            if ($this->attemptLogin($request)) {
                $ldapUser = LdapUser::where('mail', '=', $request->email)->firstOrFail();
                $user = User::firstOrCreate(
                    ['email' => $ldapUser->mail[0]],
                    ['name' => $ldapUser->cn[0], 'password' => Hash::make($request->password)]
                );

                Auth::login($user);

                $token = $user->createToken('AuthToken')->plainTextToken;

                return response()->json(['user' => $user, 'token' => $token], 200);
            } else {
                return response()->json(['message' => 'Invalid credentials'], 401);
            }
        } catch (\Exception $e) {
            return response()->json(['message' => 'Login failed', 'error' => $e->getMessage()], 500);
        }
    }

    // Get LDAP records
    public function getLdapRecords()
    {
        try {
            $users = LdapUser::all();

            return response()->json(['ldap_users' => $users], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to retrieve LDAP records', 'error' => $e->getMessage()], 500);
        }
    }
}
