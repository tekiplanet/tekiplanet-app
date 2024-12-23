<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

class UserSettingsController extends Controller
{
    public function updateProfile(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'first_name' => 'required|string|min:2',
                'last_name' => 'required|string|min:2',
                'email' => 'required|email|unique:users,email,' . auth()->id(),
                'username' => 'required|string|min:3|unique:users,username,' . auth()->id(),
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = auth()->user();
            $user->update($request->only([
                'first_name',
                'last_name',
                'email',
                'username'
            ]));

            return response()->json([
                'message' => 'Profile updated successfully',
                'user' => $user->fresh()
            ]);

        } catch (\Exception $e) {
            Log::error('Error updating user profile:', [
                'user_id' => auth()->id(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Failed to update profile',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updatePassword(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'current_password' => 'required|string',
                'new_password' => ['required', 'string', Password::min(8)
                    ->mixedCase()
                    ->numbers()
                    ->symbols()],
                'confirm_password' => 'required|string|same:new_password'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = auth()->user();

            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    'message' => 'Current password is incorrect'
                ], 422);
            }

            $user->update([
                'password' => Hash::make($request->new_password)
            ]);

            return response()->json([
                'message' => 'Password updated successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Error updating password:', [
                'user_id' => auth()->id(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Failed to update password',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updatePreferences(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'dark_mode' => 'boolean',
                'theme' => 'string|in:light,dark',
                'email_notifications' => 'boolean',
                'push_notifications' => 'boolean',
                'marketing_notifications' => 'boolean',
                'profile_visibility' => 'string|in:public,private,friends',
                'timezone' => 'string',
                'language' => 'string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = auth()->user();
            $user->update($request->all());

            return response()->json([
                'message' => 'Preferences updated successfully',
                'preferences' => $user->fresh()
            ]);

        } catch (\Exception $e) {
            Log::error('Error updating preferences:', [
                'user_id' => auth()->id(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Failed to update preferences',
                'error' => $e->getMessage()
            ], 500);
        }
    }
} 