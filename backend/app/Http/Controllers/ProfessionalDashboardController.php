<?php

namespace App\Http\Controllers;

use App\Models\Professional;
use App\Models\Hustle;
use App\Models\HustlePayment;
use App\Models\WorkstationPayment;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class ProfessionalDashboardController extends Controller
{
    public function getDashboardData()
    {
        try {
            // Get professional profile through user relationship
            $professional = Auth::user()->professional;
            
            if (!$professional) {
                return response()->json([
                    'message' => 'Professional profile not found'
                ], 404);
            }

            // Get currency settings
            $settings = Setting::first();
            $currency = [
                'code' => $settings ? $settings->default_currency : 'USD',
                'symbol' => $settings ? $settings->currency_symbol : '$'
            ];

            // Get current month's data
            $startOfMonth = Carbon::now()->startOfMonth();
            $endOfMonth = Carbon::now()->endOfMonth();

            // Calculate monthly revenue (completed payments only)
            $monthlyRevenue = HustlePayment::where('professional_id', $professional->id)
                ->where('status', 'completed')
                ->whereBetween('paid_at', [$startOfMonth, $endOfMonth])
                ->sum('amount');

            // Calculate all-time revenue
            $totalRevenue = HustlePayment::where('professional_id', $professional->id)
                ->where('status', 'completed')
                ->sum('amount');

            // Get hustle statistics
            $totalHustles = Hustle::where('assigned_professional_id', $professional->id)->count();
            $completedHustles = Hustle::where('assigned_professional_id', $professional->id)
                ->where('status', 'completed')
                ->count();
            
            // Calculate success rate
            $successRate = $totalHustles > 0 ? ($completedHustles / $totalHustles) * 100 : 0;

            // Get recent activities (last 20)
            $recentActivities = $this->getRecentActivities($professional->id);

            return response()->json([
                'currency' => $currency,
                'statistics' => [
                    'monthly_revenue' => $monthlyRevenue,
                    'total_revenue' => $totalRevenue,
                    'completed_hustles' => $completedHustles,
                    'success_rate' => round($successRate, 2),
                ],
                'recent_activities' => $recentActivities
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching professional dashboard data:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Failed to fetch dashboard data'
            ], 500);
        }
    }

    private function getRecentActivities($professionalId)
    {
        // Get hustle applications
        $hustleApplications = Hustle::with(['category'])
            ->where('assigned_professional_id', $professionalId)
            ->orderBy('created_at', 'desc')
            ->limit(20)
            ->get()
            ->map(function ($hustle) {
                return [
                    'type' => 'hustle',
                    'title' => $hustle->title,
                    'category' => $hustle->category->name,
                    'status' => $hustle->status,
                    'amount' => $hustle->budget,
                    'date' => $hustle->created_at,
                ];
            });

        // Get hustle payments
        $hustlePayments = HustlePayment::where('professional_id', $professionalId)
            ->orderBy('created_at', 'desc')
            ->limit(20)
            ->get()
            ->map(function ($payment) {
                return [
                    'type' => 'payment',
                    'title' => 'Hustle Payment',
                    'amount' => $payment->amount,
                    'status' => $payment->status,
                    'date' => $payment->created_at,
                ];
            });

        // Get workstation activities
        $workstationPayments = WorkstationPayment::whereHas('subscription', function ($query) use ($professionalId) {
                $query->whereHas('user', function ($q) use ($professionalId) {
                    $q->whereHas('professional', function ($p) use ($professionalId) {
                        $p->where('id', $professionalId);
                    });
                });
            })
            ->orderBy('created_at', 'desc')
            ->limit(20)
            ->get()
            ->map(function ($payment) {
                return [
                    'type' => 'workstation',
                    'title' => 'Workstation Payment',
                    'amount' => $payment->amount,
                    'status' => $payment->status,
                    'date' => $payment->created_at,
                ];
            });

        // Merge all activities and sort by date
        return collect()
            ->concat($hustleApplications)
            ->concat($hustlePayments)
            ->concat($workstationPayments)
            ->sortByDesc('date')
            ->take(20)
            ->values()
            ->all();
    }
} 