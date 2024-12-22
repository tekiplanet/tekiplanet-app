import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DollarSign, Clock, CheckCircle2, AlertCircle, Calendar, CreditCard, User, FileText } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { settingsService } from '@/services/settingsService';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface PaymentTabProps {
  hustle: {
    budget: number;
    status: string;
    payments?: Array<{
      id: string;
      amount: number;
      payment_type: 'initial' | 'final';
      status: 'pending' | 'completed' | 'failed';
      paid_at: string | null;
    }>;
  };
}

const PaymentTab = ({ hustle }: PaymentTabProps) => {
  const payments = hustle.payments || [];
  
  const initialPayment = payments.find(p => p.payment_type === 'initial');
  const finalPayment = payments.find(p => p.payment_type === 'final');
  
  const totalPayments = 2;
  const completedPayments = payments.filter(p => p.status === 'completed').length;
  const progress = (completedPayments / totalPayments) * 100;

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: settingsService.fetchSettings
  });

  const PaymentCard = ({ 
    type, 
    payment, 
    description 
  }: { 
    type: 'initial' | 'final'; 
    payment: typeof initialPayment; 
    description: string;
  }) => (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between p-4 rounded-xl border bg-card hover:bg-muted/50 transition-colors">
      <div className="space-y-3 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge 
            variant={payment?.status === 'completed' ? "success" : "secondary"}
            className="px-2.5 py-0.5 text-xs font-medium"
          >
            {type === 'initial' ? 'Initial Payment' : 'Final Payment'}
          </Badge>
          {payment?.status === 'completed' ? (
            <div className="p-1 rounded-full bg-green-500/10">
              <CheckCircle2 className="h-3 w-3 text-green-500" />
            </div>
          ) : (
            <div className="p-1 rounded-full bg-muted">
              <Clock className="h-3 w-3 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-xl sm:text-2xl font-bold tracking-tight">
            {formatCurrency(payment?.amount || 0, settings?.default_currency)}
          </p>
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
          {payment?.paid_at && (
            <p className="text-xs text-muted-foreground">
              Paid on {payment.paid_at}
            </p>
          )}
        </div>
      </div>
      <Badge 
        variant={payment?.status === 'completed' ? "success" : "outline"}
        className={cn(
          "mt-3 sm:mt-0 self-start sm:self-center",
          payment?.status === 'completed' ? "bg-green-500/10 text-green-600 hover:bg-green-500/20" : ""
        )}
      >
        {payment?.status.toUpperCase() || 'PENDING'}
      </Badge>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">Payment History</h2>
          <p className="text-sm text-muted-foreground">
            Track all your payments and transactions
          </p>
        </div>
      </div>

      {/* Payments Grid */}
      <div className="grid gap-4">
        {payments.map((payment) => (
          <Card 
            key={payment.id}
            className="group overflow-hidden transition-all duration-200 hover:shadow-md border-none shadow-sm"
          >
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col gap-4">
                {/* Payment Info and Status */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-base md:text-lg truncate">
                        Payment #{payment.id}
                      </h3>
                      <Badge 
                        className={`capitalize text-[10px] md:text-xs ${
                          payment.status === 'completed' ? 'bg-green-500/10 text-green-700 border-green-200' :
                          payment.status === 'pending' ? 'bg-yellow-500/10 text-yellow-700 border-yellow-200' :
                          payment.status === 'failed' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                          'bg-muted/50 text-muted-foreground border-muted'
                        }`}
                      >
                        {payment.status}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs md:text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{format(new Date(payment.date), 'MMM dd, yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{format(new Date(payment.date), 'hh:mm a')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-base md:text-lg">
                      {settings?.default_currency}{formatCurrency(payment.amount)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      via {payment.method}
                    </div>
                  </div>
                </div>

                {/* Payment Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-background/50 rounded-md p-2">
                    <CreditCard className="h-4 w-4 text-primary" />
                    <span>Transaction ID: {payment.transactionId || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-background/50 rounded-md p-2">
                    <User className="h-4 w-4 text-primary" />
                    <span>Paid by: {payment.paidBy || 'Anonymous'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-background/50 rounded-md p-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <span>Reference: {payment.reference || 'N/A'}</span>
                  </div>
                </div>

                {/* Additional Notes */}
                {payment.notes && (
                  <div className="text-sm text-muted-foreground bg-background/50 rounded-md p-2">
                    <p className="line-clamp-2">{payment.notes}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {payments.length === 0 && (
          <Card className="border-none shadow-sm">
            <CardContent className="p-8 text-center">
              <div className="text-muted-foreground">
                <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="font-medium">No Payments Yet</p>
                <p className="text-sm mt-1">
                  Your payment history will appear here
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PaymentTab; 