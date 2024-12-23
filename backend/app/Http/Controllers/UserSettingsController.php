<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\Rule;

class UserSettingsController extends Controller
{
    public function updateProfile(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'first_name' => 'required|string|min:2',
                'last_name' => 'required|string|min:2',
                'email' => [
                    'required',
                    'email',
                    Rule::unique('users')->ignore(auth()->id())
                ],
            ], [
                // Custom validation messages
                'first_name.required' => 'Please enter your first name',
                'first_name.min' => 'First name must be at least 2 characters',
                'last_name.required' => 'Please enter your last name',
                'last_name.min' => 'Last name must be at least 2 characters',
                'email.required' => 'Please enter your email address',
                'email.email' => 'Please enter a valid email address',
                'email.unique' => 'This email is already registered to another account'
            ]);

            if ($validator->fails()) {
                // Get the first validation error message
                $firstError = collect($validator->errors()->all())->first();
                
                return response()->json([
                    'message' => $firstError, // Use the specific error message as the main message
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = auth()->user();
            $user->update($request->only([
                'first_name',
                'last_name',
                'email'
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

            if ($e instanceof \Illuminate\Database\QueryException && str_contains($e->getMessage(), 'Duplicate entry')) {
                return response()->json([
                    'message' => 'This email address is already being used by another account',
                    'errors' => ['email' => ['Please use a different email address']]
                ], 422);
            }

            return response()->json([
                'message' => 'Something went wrong while updating your profile. Please try again.',
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
            ], [
                'current_password.required' => 'Please enter your current password',
                'new_password.required' => 'Please enter a new password',
                'new_password.min' => 'Your new password must be at least 8 characters',
                'confirm_password.required' => 'Please confirm your new password',
                'confirm_password.same' => 'The passwords you entered do not match'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Please check your password entries',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = auth()->user();

            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    'message' => 'The current password you entered is incorrect',
                    'errors' => ['current_password' => ['Please check your current password and try again']]
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
            ], [
                'profile_visibility.in' => 'Please select a valid privacy option',
                'theme.in' => 'Please select either light or dark theme'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Some of your preferences could not be saved',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = auth()->user();
            
            // Only update dark_mode based on theme
            if ($request->has('theme')) {
                $user->dark_mode = $request->theme === 'dark';
            }

            // Update notification preferences
            if ($request->has('email_notifications')) {
                $user->email_notifications = $request->email_notifications;
            }
            if ($request->has('push_notifications')) {
                $user->push_notifications = $request->push_notifications;
            }
            if ($request->has('marketing_notifications')) {
                $user->marketing_notifications = $request->marketing_notifications;
            }

            // Update other preferences
            if ($request->has('profile_visibility')) {
                $user->profile_visibility = $request->profile_visibility;
            }
            if ($request->has('timezone')) {
                $user->timezone = $request->timezone;
            }
            if ($request->has('language')) {
                $user->language = $request->language;
            }

            $user->save();

            return response()->json([
                'message' => 'Preferences updated successfully',
                'user' => $user->makeVisible([
                    'dark_mode',
                    'email_notifications',
                    'push_notifications',
                    'marketing_notifications',
                    'profile_visibility',
                    'timezone',
                    'language'
                ])
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