<?php

namespace App\Http\Controllers;

use App\Services\BusinessMetricsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class BusinessMetricsController extends Controller
{
    protected $metricsService;

    public function __construct(BusinessMetricsService $metricsService)
    {
        $this->metricsService = $metricsService;
    }

    public function getMetrics(Request $request)
    {
        try {
            // Get business profile ID for authenticated user
            $businessProfile = $request->user()->businessProfile;

            if (!$businessProfile) {
                return response()->json([
                    'message' => 'No business profile found'
                ], 404);
            }

            $metrics = $this->metricsService->getBusinessMetrics($businessProfile->id);

            return response()->json($metrics);

        } catch (\Exception $e) {
            Log::error('Error fetching business metrics:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Failed to fetch business metrics',
                'error' => $e->getMessage()
            ], 500);
        }
    }
} 