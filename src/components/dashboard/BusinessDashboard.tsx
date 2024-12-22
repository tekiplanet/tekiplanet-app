import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DollarSign, 
  Users, 
  Package, 
  FileText,
  TrendingUp,
  ShoppingBag,
  AlertCircle,
  Plus,
  ArrowRight,
  Bell,
  BarChart3,
  Calendar,
  CircleDollarSign,
  Wallet,
  UserPlus
} from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { businessService, BusinessMetrics } from '@/services/businessService';
import NoBusinessProfile from '../business/NoBusinessProfile';
import InactiveBusinessProfile from '../business/InactiveBusinessProfile';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import TransactionList from './TransactionList';

// Helper function for formatting currency
const formatAmount = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Helper function for formatting currency with specific currency code
const formatAmountWithCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Quick Action Component
const QuickAction = ({ icon: Icon, title, onClick, variant = "default" }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <Card 
      className={cn(
        "cursor-pointer hover:shadow-md transition-all",
        variant === "primary" && "bg-primary text-primary-foreground"
      )}
      onClick={onClick}
    >
      <CardContent className="p-3">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-lg",
            variant === "primary" ? "bg-primary-foreground/10" : "bg-primary/10"
          )}>
            <Icon className={cn(
              "h-4 w-4",
              variant === "primary" ? "text-primary-foreground" : "text-primary"
            )} />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium">{title}</h3>
          </div>
          <ArrowRight className={cn(
            "h-4 w-4 opacity-50",
            variant === "primary" ? "text-primary-foreground" : "text-foreground"
          )} />
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

// Metric Card Component with Animation
const MetricCard = ({ 
  title, 
  value, 
  trend, 
  icon: Icon, 
  trendValue, 
  isLoading, 
  color = "primary",
  className 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <Card className={cn(
      "relative overflow-hidden",
      className
    )}>
      <div className={cn(
        "absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 transform translate-x-8 -translate-y-8",
        `bg-${color}-500`
      )} />
      <CardContent className={cn(
        "p-6",
        className?.includes("h-[100px]") && "py-4"  // Reduce padding for smaller cards
      )}>
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4">
            <div className={cn(
              "p-3 rounded-xl",
              `bg-${color}-500/10`
            )}>
              <Icon className={cn(
                "h-6 w-6",
                `text-${color}-500`
              )} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              {isLoading ? (
                <div className="h-8 w-24 animate-pulse bg-muted rounded" />
              ) : (
                <h3 className={cn(
                  "font-bold",
                  className?.includes("h-[100px]") ? "text-xl" : "text-2xl"
                )}>{value}</h3>
              )}
            </div>
          </div>
          {trend && (
            <Badge variant={trend === 'up' ? 'success' : 'destructive'} className="h-6">
              <TrendingUp className={cn(
                "h-4 w-4 mr-1",
                trend === 'down' && "rotate-180"
              )} />
              {trendValue}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

// Add this interface for activities
interface Activity {
  type: 'customer_added' | 'invoice_created' | 'payment_received';
  title: string;
  time: string;
  amount: number | null;
  currency: string | null;
}

// Update the ActivityItem component
const ActivityItem = ({ 
  icon: Icon, 
  title, 
  time, 
  amount, 
  currency, 
  status 
}: { 
  icon: LucideIcon; 
  title: string; 
  time: string; 
  amount?: number;
  currency?: string;
  status?: string; 
}) => (
  <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50">
    <div className={cn(
      "p-2 rounded-full",
      status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-primary/10 text-primary'
    )}>
      <Icon className="h-4 w-4" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(time))} ago</p>
    </div>
    {amount && currency && (
      <div className="text-right">
        <p className="text-sm font-medium">{formatAmountWithCurrency(amount, currency)}</p>
      </div>
    )}
  </div>
);

export default function BusinessDashboard() {
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const navigate = useNavigate();

  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ['business-profile'],
    queryFn: businessService.checkProfile,
    retry: false
  });

  const { data: metrics, isLoading: metricsLoading } = useQuery<BusinessMetrics>({
    queryKey: ['business-metrics'],
    queryFn: () => businessService.getMetrics(),
    enabled: !!profileData?.has_profile,
    onSuccess: (data) => {
      console.log('Metrics data:', data, 'Recent activities:', data.recent_activities);
    },
    onError: (error) => {
      console.error('Metrics error:', error);
    }
  });

  if (profileLoading) {
    return <LoadingSkeleton />;
  }

  if (!profileData?.has_profile) {
    return <NoBusinessProfile />;
  }

  if (profileData?.profile?.status === 'inactive') {
    return <InactiveBusinessProfile />;
  }

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-primary">
            <AvatarImage src={profileData?.profile?.logo} />
            <AvatarFallback>BP</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {profileData?.profile?.business_name}
            </h1>
            <p className="text-muted-foreground">
              {format(new Date(), 'EEEE, MMMM do yyyy')}
            </p>
          </div>
        </div>
        <Button 
          className="flex items-center gap-2"
          onClick={() => setIsQuickActionOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Quick Action
        </Button>
      </div>

      {/* Quick Actions Dialog */}
      <Dialog open={isQuickActionOpen} onOpenChange={setIsQuickActionOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Quick Actions</DialogTitle>
          </DialogHeader>
          <div className="grid gap-2 py-2">
            <QuickAction
              icon={CircleDollarSign}
              title="Create Invoice"
              onClick={() => {
                setIsQuickActionOpen(false);
                // Add navigation logic
              }}
              variant="primary"
            />
            <QuickAction
              icon={Package}
              title="Add Inventory"
              onClick={() => {
                setIsQuickActionOpen(false);
                // Add navigation logic
              }}
            />
            <QuickAction
              icon={Users}
              title="Add Customer"
              onClick={() => {
                setIsQuickActionOpen(false);
                // Add navigation logic
              }}
            />
            <QuickAction
              icon={Wallet}
              title="Record Payment"
              onClick={() => {
                setIsQuickActionOpen(false);
                // Add navigation logic
              }}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Metrics Section */}
      <div className="space-y-4">
        {/* Monthly Revenue - Full Width */}
        <div className="w-full">
          <MetricCard
            title="Monthly Revenue"
            value={metrics?.revenue ? formatAmount(metrics.revenue) : formatAmount(0)}
            trend={metrics?.revenue_trend?.direction}
            trendValue={`${metrics?.revenue_trend?.percentage}%`}
            icon={DollarSign}
            isLoading={metricsLoading}
            color="green"
          />
        </div>
        
        {/* Customer Metrics - Stack on mobile, side by side on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MetricCard
            title="Total Customers"
            value={metrics?.total_customers || "0"}
            trend={undefined}
            trendValue={undefined}
            icon={Users}
            isLoading={metricsLoading}
            color="blue"
            className="h-[100px]"
          />
          <MetricCard
            title="This Month"
            value={metrics?.customers_this_month?.toString() || "0"}
            trend={metrics?.customer_trend?.direction}
            trendValue={`${metrics?.customer_trend?.percentage}%`}
            icon={UserPlus}
            isLoading={metricsLoading}
            color="green"
            className="h-[100px]"
          />
        </div>
      </div>

      {/* Main Content Tabs - Fix mobile overflow */}
      <Tabs defaultValue="overview" className="space-y-6">
        <div className="relative -mx-4 md:mx-0">
          <div className="border-b overflow-x-auto scrollbar-none">
            <div className="min-w-full inline-block px-4 md:px-0">
              <TabsList className="flex w-auto bg-transparent p-0">
                <TabsTrigger 
                  value="overview" 
                  className="flex items-center gap-1 px-3 py-2 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none whitespace-nowrap text-sm"
                >
                  <BarChart3 className="h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="transactions" 
                  className="flex items-center gap-1 px-3 py-2 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none whitespace-nowrap text-sm"
                >
                  <CircleDollarSign className="h-4 w-4" />
                  Transactions
                </TabsTrigger>
              </TabsList>
            </div>
          </div>
        </div>

        <TabsContent value="overview" className="space-y-6">
          {/* Charts Grid - Stack on mobile, side by side on md screens */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Revenue Overview - Full width on mobile */}
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Monthly revenue breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] md:h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={metrics?.revenueData || []}>
                      <defs>
                        <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))'
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="hsl(var(--primary))"
                        fillOpacity={1}
                        fill="url(#revenue)"
                        name="Revenue"
                        formatter={(value: number) => formatAmount(value)}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity - Full width on mobile */}
            <Card className="w-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
                  <CardDescription>Latest business transactions</CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => navigate('/dashboard/business/activities')}
                >
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[250px] md:h-[300px]">
                  <div className="space-y-1 pr-4">
                    {console.log('Rendering activities:', metrics?.recent_activities)}
                    {metrics?.recent_activities?.map((activity: Activity, index) => {
                      let icon = CircleDollarSign;
                      switch (activity.type) {
                        case 'customer_added':
                          icon = Users;
                          break;
                        case 'invoice_created':
                          icon = FileText;
                          break;
                        case 'payment_received':
                          icon = CircleDollarSign;
                          break;
                      }

                      return (
                        <ActivityItem
                          key={index}
                          icon={icon}
                          title={activity.title}
                          time={activity.time}
                          amount={activity.amount || undefined}
                          currency={activity.currency || undefined}
                          status={activity.type === 'payment_received' ? 'completed' : undefined}
                        />
                      );
                    })}

                    {(!metrics?.recent_activities || metrics.recent_activities.length === 0) && (
                      <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
                        <p>No recent activities</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <TransactionList />
        </TabsContent>
      </Tabs>
    </div>
  );
}

const LoadingSkeleton = () => (
  <div className="space-y-8 p-8">
    <div className="h-20 bg-muted rounded-lg animate-pulse" />
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
      ))}
    </div>
    <div className="grid gap-4 md:grid-cols-2">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="h-[400px] bg-muted rounded-lg animate-pulse" />
      ))}
    </div>
  </div>
);