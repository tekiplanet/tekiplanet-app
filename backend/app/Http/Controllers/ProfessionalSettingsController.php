<?php

namespace App\Http\Controllers;

use App\Models\Professional;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class ProfessionalSettingsController extends Controller
{
    public function updateProfile(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'title' => 'required|string|min:2',
                'specialization' => 'required|string|min:2',
                'expertise_areas' => 'required|array|min:1',
                'bio' => 'required|string|max:500',
                'certifications' => 'nullable|array',
                'linkedin_url' => 'nullable|url',
                'github_url' => 'nullable|url',
                'portfolio_url' => 'nullable|url',
                'preferred_contact_method' => 'required|in:email,phone,whatsapp',
                'languages' => 'required|array|min:1',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = auth()->user();
            $professional = $user->professional;

            $professional->update($request->only([
                'title',
                'specialization',
                'expertise_areas',
                'bio',
                'certifications',
                'linkedin_url',
                'github_url',
                'portfolio_url',
                'preferred_contact_method',
                'languages'
            ]));

            return response()->json([
                'message' => 'Professional profile updated successfully',
                'user' => $user->fresh()
            ]);

        } catch (\Exception $e) {
            Log::error('Error updating professional profile:', [
                'user_id' => auth()->id(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Failed to update professional profile',
                'error' => $e->getMessage()
            ], 500);
        }
    }
} 