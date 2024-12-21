<?php

namespace App\Services;

use App\Models\BusinessInvoice;
use App\Models\BusinessInvoicePayment;
use App\Models\BusinessCustomer;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class BusinessMetricsService
{
    protected $currencyService;

    public function __construct(CurrencyService $currencyService)
    {
        $this->currencyService = $currencyService;
    }

    public function getBusinessMetrics($businessId)
    {
        $totalCustomers = $this->getTotalCustomers($businessId);
        $customersThisMonth = $this->getCustomersThisMonth($businessId);
        
        return [
            'revenue' => $this->calculateMonthlyRevenue($businessId),
            'total_customers' => $totalCustomers,
            'customers_this_month' => $customersThisMonth,
            'customer_growth' => $this->calculateCustomerGrowth($totalCustomers, $customersThisMonth),
            'revenueData' => $this->getRevenueChartData($businessId),
            'recent_activities' => $this->getRecentActivities($businessId)
        ];
    }

    protected function calculateMonthlyRevenue($businessId)
    {
        $businessInvoices = BusinessInvoice::where('business_id', $businessId)
            ->pluck('id');

        $totalRevenue = BusinessInvoicePayment::whereIn('invoice_id', $businessInvoices)
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->sum('converted_amount');

        Log::info('Monthly revenue calculation:', [
            'business_id' => $businessId,
            'total_revenue' => $totalRevenue
        ]);

        return $totalRevenue;
    }

    protected function getRevenueChartData($businessId)
    {
        $data = [];
        $sixMonthsAgo = now()->subMonths(5); // Get 6 months including current

        for ($i = 0; $i < 6; $i++) {
            $month = $sixMonthsAgo->copy()->addMonths($i);
            $data[] = [
                'name' => $month->format('M Y'),
                'value' => $this->getMonthRevenue($businessId, $month)
            ];
        }

        return $data;
    }

    protected function getMonthRevenue($businessId, $month)
    {
        $businessInvoices = BusinessInvoice::where('business_id', $businessId)
            ->pluck('id');

        return BusinessInvoicePayment::whereIn('invoice_id', $businessInvoices)
            ->whereMonth('created_at', $month->month)
            ->whereYear('created_at', $month->year)
            ->sum('converted_amount');
    }

    protected function getTotalCustomers($businessId)
    {
        return BusinessCustomer::where('business_id', $businessId)->count();
    }

    protected function getCustomersData($businessId)
    {
        return BusinessCustomer::where('business_id', $businessId)
            ->select('id', 'created_at')
            ->get();
    }

    protected function getCustomersThisMonth($businessId)
    {
        return BusinessCustomer::where('business_id', $businessId)
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();
    }

    protected function calculateCustomerGrowth($total, $thisMonth)
    {
        if ($total === 0) return "0%";
        $percentage = ($thisMonth / $total) * 100;
        return number_format($percentage, 0) . '%';
    }

    protected function getRecentActivities($businessId, $limit = 20)
    {
        Log::info('Fetching recent activities for business:', ['business_id' => $businessId]);

        // Get recent customers
        $customers = BusinessCustomer::where('business_id', $businessId)
            ->select('id', 'name', 'created_at')
            ->latest()
            ->limit($limit)
            ->get();

        Log::info('Recent customers:', ['count' => $customers->count()]);

        $customers = $customers->map(function($customer) {
            return [
                'type' => 'customer_added',
                'title' => "New customer added: {$customer->name}",
                'time' => $customer->created_at,
                'amount' => null,
                'currency' => null
            ];
        });

        // Get recent invoices
        $invoices = BusinessInvoice::where('business_id', $businessId)
            ->select('id', 'invoice_number', 'amount', 'currency', 'created_at', 'customer_id')
            ->with('customer:id,name')
            ->latest()
            ->limit($limit)
            ->get();

        Log::info('Recent invoices:', ['count' => $invoices->count()]);

        $invoices = $invoices->map(function($invoice) {
            return [
                'type' => 'invoice_created',
                'title' => "Invoice #{$invoice->invoice_number} created for {$invoice->customer->name}",
                'time' => $invoice->created_at,
                'amount' => $invoice->amount,
                'currency' => $invoice->currency
            ];
        });

        // Get recent payments
        $payments = BusinessInvoicePayment::whereHas('invoice', function($query) use ($businessId) {
            $query->where('business_id', $businessId);
        })
        ->with(['invoice:id,invoice_number,customer_id', 'invoice.customer:id,name'])
        ->select('id', 'invoice_id', 'amount', 'currency', 'created_at')
        ->latest()
        ->limit($limit)
        ->get();

        Log::info('Recent payments:', ['count' => $payments->count()]);

        $payments = $payments->map(function($payment) {
            return [
                'type' => 'payment_received',
                'title' => "Payment received for Invoice #{$payment->invoice->invoice_number} from {$payment->invoice->customer->name}",
                'time' => $payment->created_at,
                'amount' => $payment->amount,
                'currency' => $payment->currency
            ];
        });

        // Combine all activities and sort by time
        $activities = $customers->concat($invoices)
            ->concat($payments)
            ->sortByDesc('time')
            ->take($limit)
            ->values()
            ->all();

        Log::info('Combined activities:', ['count' => count($activities)]);

        return $activities;
    }
}
