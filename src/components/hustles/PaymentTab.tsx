import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DollarSign, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { settingsService } from '@/services/settingsService';
import { cn } from '@/lib/utils';

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
      {/* Payment Progress */}
      <Card className="overflow-hidden border-none shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-2 rounded-full bg-primary/10">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            Payment Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {completedPayments} of {totalPayments} payments released
            </span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Payment Details */}
      <Card className="overflow-hidden border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">Payment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Initial Payment */}
          <PaymentCard 
            type="initial"
            payment={initialPayment}
            description="Released upon project approval"
          />

          {/* Final Payment */}
          <PaymentCard 
            type="final"
            payment={finalPayment}
            description="Released upon project completion"
          />

          {/* Total Amount */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between p-4 rounded-xl bg-muted/50 backdrop-blur-sm">
            <div className="space-y-1.5">
              <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
              <p className="text-xl sm:text-2xl font-bold tracking-tight">
                {formatCurrency(hustle.budget, settings?.default_currency)}
              </p>
            </div>
            <Badge 
              variant="secondary"
              className="mt-3 sm:mt-0 self-start sm:self-center bg-background/50 backdrop-blur-sm"
            >
              {hustle.status.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentTab; 