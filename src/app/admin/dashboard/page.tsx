
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Users, CreditCard, Activity, Download, Package, ShoppingCart, Loader2, Mail } from 'lucide-react'; // Added Mail
import { Skeleton } from '@/components/ui/skeleton';
import { getProducts } from '@/lib/product-service';
import { getTotalRevenue, getTotalOrderCount, getPendingOrderCount, getRecentOrders } from '@/lib/order-service';
import { getTotalUserCount } from '@/lib/user-service';
import { getNewsletterSubscriptionCount } from '@/lib/newsletter-service'; // Import newsletter service
import type { Product, Order } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";

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
        <Icon className="h-5 w-5 text-muted-foreground" data-ai-hint={dataAiHint}/>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{typeof value === 'number' && title.includes("Revenue") ? `GH₵ ${value.toFixed(2)}` : value}</div>
        {change && <p className="text-xs text-muted-foreground">{change}</p>}
      </CardContent>
    </Card>
  );
};

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [isLoadingRecentOrders, setIsLoadingRecentOrders] = useState(true);
  
  const [stats, setStats] = useState([
    { title: 'Total Revenue', value: 0, icon: DollarSign, dataAiHint: 'financial graph' },
    { title: 'Total Sales', value: 0, icon: ShoppingCart, dataAiHint: 'sales chart' },
    { title: 'Active Customers', value: 0, icon: Users, dataAiHint: 'customer demographics' },
    { title: 'Pending Orders', value: 0, icon: Package, dataAiHint: 'order fulfillment' },
    { title: 'Newsletter Subscribers', value: 0, icon: Mail, dataAiHint: 'subscriber count' }, // Added newsletter stat
  ]);

  const { toast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoadingStats(true);
      setIsLoadingRecentOrders(true);
      try {
        const [
            revenue, 
            totalOrders, 
            totalUsers, 
            pendingOrdersData, 
            recentOrdersData,
            newsletterSubscribersCount // Fetch newsletter count
        ] = await Promise.all([
          getTotalRevenue(),
          getTotalOrderCount(),
          getTotalUserCount(),
          getPendingOrderCount(),
          getRecentOrders(5),
          getNewsletterSubscriptionCount() 
        ]);
        
        setStats([
          { title: 'Total Revenue', value: revenue, icon: DollarSign, dataAiHint: 'financial graph' },
          { title: 'Total Sales', value: totalOrders, icon: ShoppingCart, dataAiHint: 'sales chart' },
          { title: 'Active Customers', value: totalUsers, icon: Users, dataAiHint: 'customer demographics' },
          { title: 'Pending Orders', value: pendingOrdersData, icon: Package, dataAiHint: 'order fulfillment' },
          { title: 'Newsletter Subscribers', value: newsletterSubscribersCount, icon: Mail, dataAiHint: 'subscriber count' },
        ]);
        setRecentOrders(recentOrdersData);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        toast({title: "Error", description: "Could not load dashboard data.", variant: "destructive"});
      }
      setIsLoadingStats(false);
      setIsLoadingRecentOrders(false);
    };

    const fetchProductDataForExport = async () => {
      setIsLoadingProducts(true);
      try {
        const fetchedProducts = await getProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Failed to fetch products for export:", error);
        toast({title: "Error", description: "Could not load product data for export.", variant: "destructive"});
      }
      setIsLoadingProducts(false);
    };

    fetchDashboardData();
    fetchProductDataForExport();
  }, [toast]);

  const convertToCSV = (data: Product[]): string => {
    if (!data || data.length === 0) return '';
    const headers = ['ID', 'Name', 'Price', 'Category', 'Stock', 'Status', 'Description', 'Image URLs', 'Rating', 'Reviews', 'Data AI Hint', 'Sizes'];
    const rows = data.map(product => [
      product.id,
      `"${product.name.replace(/"/g, '""')}"`,
      product.price,
      `"${product.category.replace(/"/g, '""')}"`,
      product.stock,
      product.status,
      `"${product.description.replace(/"/g, '""')}"`,
      `"${product.imageUrls.join(', ')}"`,
      product.rating ?? '',
      product.reviews ?? '',
      `"${product.dataAiHint.replace(/"/g, '""')}"`,
      `"${product.sizes?.join('; ') ?? ''}"`
    ].join(','));
    return [headers.join(','), ...rows].join('\n');
  };

  const handleExportProductsCSV = () => {
    if (isLoadingProducts || products.length === 0) {
      toast({title: "Export Not Ready", description: isLoadingProducts ? "Product data is still loading." : "No product data to export.", variant: "destructive"});
      return;
    }
    const csvData = convertToCSV(products);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'product_inventory.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast({title: "Export Successful", description: "Product inventory CSV downloaded."});
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-semibold">Dashboard</h1>
        <Button variant="outline" onClick={handleExportProductsCSV} disabled={isLoadingProducts || products.length === 0}>
          <Download className="mr-2 h-4 w-4" />
          {isLoadingProducts ? 'Loading Data...' : (products.length === 0 ? 'No Data to Export' : 'Export Product Inventory (CSV)')}
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3 xl:grid-cols-5 mt-6"> {/* Adjusted grid for 5 cards */}
        {stats.map((stat) => (
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
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3 mt-8">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline">Recent Sales Overview</CardTitle>
            <CardDescription>A summary of sales activity over the past month.</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[350px] w-full bg-muted rounded-md flex items-center justify-center">
              {isLoadingStats ? (
                <Loader2 className="h-16 w-16 text-muted-foreground animate-spin" />
              ) : (
                <>
                  <Activity className="h-16 w-16 text-muted-foreground" data-ai-hint="sales graph" />
                  <p className="ml-4 text-muted-foreground">Sales Chart (Data loaded, component pending)</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Recent Orders</CardTitle>
            <CardDescription>Top 5 most recent orders.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-1">
            {isLoadingRecentOrders ? (
              Array.from({length: 5}).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-md">
                  <div className="grid gap-1.5 flex-grow">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <Skeleton className="h-5 w-1/4" />
                </div>
              ))
            ) : recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <Link key={order.id} href={`/admin/orders/${order.id}`} className="block">
                  <div className="flex items-center gap-4 p-3 rounded-md hover:bg-muted/50 transition-colors">
                    <div className="grid gap-0.5 flex-grow">
                      <p className="text-sm font-medium leading-none">Order #{order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.customerFullName || order.customerEmail || 'N/A'}</p>
                    </div>
                    <div className="ml-auto font-medium">GH₵ {order.totalAmount.toFixed(2)}</div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-sm text-muted-foreground p-3">No recent orders found.</p>
            )}
             <Button variant="outline" size="sm" className="mt-4 w-full" asChild>
                <Link href="/admin/orders">View All Orders</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
