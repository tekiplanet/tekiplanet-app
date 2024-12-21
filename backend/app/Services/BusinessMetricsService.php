<?php

namespace App\Services;

use App\Models\BusinessInvoice;
use App\Models\BusinessInvoicePayment;
use App\Models\BusinessCustomer;
use Carbon\Carbon;

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
            'revenueData' => $this->getRevenueChartData($businessId)
        ];
    }

    protected function calculateMonthlyRevenue($businessId)
    {
        $businessInvoices = BusinessInvoice::where('business_id', $businessId)
            ->pluck('id');

        return BusinessInvoicePayment::whereIn('invoice_id', $businessInvoices)
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->sum('converted_amount');
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

        $totalNGN = 0;
        
        BusinessInvoicePayment::whereIn('invoice_id', $businessInvoices)
            ->whereMonth('created_at', $month->month)
            ->whereYear('created_at', $month->year)
            ->chunk(100, function($payments) use (&$totalNGN) {
                foreach($payments as $payment) {
                    $totalNGN += $this->currencyService->convertToNGN(
                        $payment->amount, 
                        $payment->currency
                    );
                }
            });

        return $totalNGN;
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
}
