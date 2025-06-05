
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart, PieChart, ShoppingBag, Users, TrendingUp, DollarSign, Activity, Loader2, Package } from "lucide-react"; // Added Package
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from "@/hooks/use-toast";

import { getTotalRevenue, getTotalOrderCount, getOrdersGroupedByStatus } from '@/lib/order-service';
import { getTotalUserCount } from '@/lib/user-service';
import { getProductsGroupedByCategory, getTotalProductCount } from '@/lib/product-service';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ElementType;
  isLoading: boolean;
  dataAiHint?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon: Icon, isLoading, dataAiHint }) => {
  if (isLoading) {
    return (
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-5 w-5 rounded-full" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-1/2 mb-1" />
          <Skeleton className="h-4 w-1/3" />
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" data-ai-hint={dataAiHint} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{typeof value === 'number' && title.includes("Revenue") ? `GH₵ ${value.toFixed(2)}` : value}</div>
        {change && <p className="text-xs text-muted-foreground">{change}</p>}
      </CardContent>
    </Card>
  );
};

interface ChartDataState {
  salesTrend: { count: number; isLoading: boolean };
  topCategories: { data: Record<string, number>; isLoading: boolean };
  userActivity: { count: number; isLoading: boolean };
}

export default function AdminAnalyticsPage() {
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const { toast } = useToast();

  const [overviewStats, setOverviewStats] = useState([
    { title: "Total Revenue", value: 0, icon: DollarSign, dataAiHint: "revenue graph" },
    { title: "Total Orders", value: 0, icon: ShoppingBag, dataAiHint: "orders chart" },
    { title: "Total Customers", value: 0, icon: Users, dataAiHint: "customer growth" }, // Changed from New Customers
    { title: "Total Products", value: 0, icon: Package, dataAiHint: "product inventory" }, // Changed from Conversion Rate
  ]);

  const [chartData, setChartData] = useState<ChartDataState>({
    salesTrend: { count: 0, isLoading: true },
    topCategories: { data: {}, isLoading: true },
    userActivity: { count: 0, isLoading: true },
  });

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setIsLoadingStats(true);
      setChartData(prev => ({
          salesTrend: { ...prev.salesTrend, isLoading: true },
          topCategories: { ...prev.topCategories, isLoading: true },
          userActivity: { ...prev.userActivity, isLoading: true },
      }));

      try {
        const [revenue, totalOrdersData, totalUsersData, totalProductsData, ordersByStatusData, productsByCategoryData] = await Promise.all([
          getTotalRevenue(),
          getTotalOrderCount(),
          getTotalUserCount(),
          getTotalProductCount(),
          getOrdersGroupedByStatus(), // For Sales Trend (can be refined)
          getProductsGroupedByCategory(), // For Top Product Categories
        ]);
        
        setOverviewStats([
          { title: "Total Revenue", value: revenue, icon: DollarSign, dataAiHint: "revenue graph" },
          { title: "Total Orders", value: totalOrdersData, icon: ShoppingBag, dataAiHint: "orders chart" },
          { title: "Total Customers", value: totalUsersData, icon: Users, dataAiHint: "customer growth" },
          { title: "Total Products", value: totalProductsData, icon: Package, dataAiHint: "product inventory" },
        ]);

        setChartData({
          salesTrend: { count: totalOrdersData, isLoading: false }, // Using total orders as a proxy for trend
          topCategories: { data: productsByCategoryData, isLoading: false },
          userActivity: { count: totalUsersData, isLoading: false }, // Using total users as a proxy
        });

      } catch (error) {
        console.error("Failed to fetch analytics data:", error);
        toast({title: "Error", description: "Could not load analytics data.", variant: "destructive"});
      }
      setIsLoadingStats(false);
      // Individual chart loading states are set within the try/catch result
    };

    fetchAnalyticsData();
  }, [toast]);

  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-semibold">Analytics Overview</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {overviewStats.map((stat) => (
          <StatCard 
            key={stat.title} 
            title={stat.title} 
            value={stat.value} 
            icon={stat.icon} 
            isLoading={isLoadingStats}
            dataAiHint={stat.dataAiHint}
          />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Sales Trend</CardTitle>
            <CardDescription>Monthly sales performance insights.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center bg-muted rounded-b-lg">
            {chartData.salesTrend.isLoading ? (
              <Loader2 className="h-16 w-16 text-primary animate-spin" />
            ) : (
              <div className="text-center">
                <LineChart className="h-16 w-16 text-primary mx-auto mb-2" data-ai-hint="sales line chart" />
                {chartData.salesTrend.count > 0 ? (
                  <p className="text-muted-foreground">Total Orders: {chartData.salesTrend.count}. Chart component pending.</p>
                ) : (
                  <p className="text-muted-foreground">No sales data available for trend chart.</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Top Product Categories</CardTitle>
            <CardDescription>Distribution of products by category.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center bg-muted rounded-b-lg">
             {chartData.topCategories.isLoading ? (
              <Loader2 className="h-16 w-16 text-primary animate-spin" />
            ) : (
              <div className="text-center">
                <PieChart className="h-16 w-16 text-primary mx-auto mb-2" data-ai-hint="category pie chart" />
                 {Object.keys(chartData.topCategories.data).length > 0 ? (
                  <p className="text-muted-foreground">Categories: {Object.keys(chartData.topCategories.data).join(', ')}. Chart component pending.</p>
                ) : (
                  <p className="text-muted-foreground">No product category data available.</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

       <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">User Activity</CardTitle>
            <CardDescription>Site visits and user engagement metrics.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center bg-muted rounded-b-lg">
            {chartData.userActivity.isLoading ? (
              <Loader2 className="h-16 w-16 text-primary animate-spin" />
            ) : (
              <div className="text-center">
                <BarChart className="h-16 w-16 text-primary mx-auto mb-2" data-ai-hint="activity bar chart" />
                {chartData.userActivity.count > 0 ? (
                  <p className="text-muted-foreground">Total Users: {chartData.userActivity.count}. Chart component pending.</p>
                ) : (
                   <p className="text-muted-foreground">No user data available for activity chart.</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl">Advanced Analytics</CardTitle>
          <CardDescription>
            More detailed reports and custom analytics dashboards will be available here.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-10">
          <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" data-ai-hint="analytics dashboard"/>
          <p className="text-muted-foreground">Feature Under Development</p>
        </CardContent>
      </Card>
    </div>
  );
}
