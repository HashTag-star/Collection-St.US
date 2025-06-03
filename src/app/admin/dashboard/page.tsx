
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Users, CreditCard, Activity, Download, Package } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { getProducts } from '@/lib/product-service';
import type { Product } from '@/lib/types';

// Mock Data for stats
const stats = [
  { title: 'Total Revenue', value: 'GH₵ 45,231.89', change: '+20.1% from last month', icon: DollarSign, dataAiHint: 'financial graph' },
  { title: 'Total Sales', value: '+12,234', change: '+10.5% from last month', icon: CreditCard, dataAiHint: 'sales chart' },
  { title: 'Active Customers', value: '+573', change: '+21 from last week', icon: Users, dataAiHint: 'customer demographics' },
  { title: 'Pending Orders', value: '32', change: '5 new today', icon: Package, dataAiHint: 'order fulfillment' },
];

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoadingProducts(true);
      try {
        const fetchedProducts = await getProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Failed to fetch products for export:", error);
        // Optionally, show a toast message
      }
      setIsLoadingProducts(false);
    };
    fetchProducts();
  }, []);

  const convertToCSV = (data: Product[]): string => {
    if (!data || data.length === 0) {
      return '';
    }
    const headers = ['ID', 'Name', 'Price', 'Category', 'Stock', 'Status', 'Description', 'Image URLs', 'Rating', 'Reviews', 'Data AI Hint', 'Sizes'];
    const rows = data.map(product => [
      product.id,
      `"${product.name.replace(/"/g, '""')}"`, // Escape double quotes in name
      product.price,
      `"${product.category.replace(/"/g, '""')}"`,
      product.stock,
      product.status,
      `"${product.description.replace(/"/g, '""')}"`, // Escape double quotes in description
      `"${product.imageUrls.join(', ')}"`,
      product.rating ?? '',
      product.reviews ?? '',
      `"${product.dataAiHint.replace(/"/g, '""')}"`,
      `"${product.sizes?.join('; ') ?? ''}"` // Join sizes with semicolon, handle undefined
    ].join(','));
    return [headers.join(','), ...rows].join('\n');
  };

  const handleExportProductsCSV = () => {
    if (products.length === 0) {
      // Optionally, show a toast message that there's no data to export
      console.log("No product data to export.");
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
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4 mt-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3 mt-8">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline">Recent Sales Overview</CardTitle>
            <CardDescription>A summary of sales activity over the past month.</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {/* Placeholder for a chart */}
            <div className="h-[350px] w-full bg-muted rounded-md flex items-center justify-center">
              <Activity className="h-16 w-16 text-muted-foreground" data-ai-hint="sales graph" />
              <p className="ml-4 text-muted-foreground">Sales Chart Placeholder</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Recent Orders</CardTitle>
            <CardDescription>Top 5 most recent orders.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-2 rounded-md hover:bg-muted/50 transition-colors">
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">Order #{12345 - i}</p>
                  <p className="text-sm text-muted-foreground">customer{i+1}@example.com</p>
                </div>
                <div className="ml-auto font-medium">GH₵ {((i+1) * 27.50).toFixed(2)}</div>
              </div>
            ))}
             <Button variant="outline" size="sm" className="mt-2">View All Orders</Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
