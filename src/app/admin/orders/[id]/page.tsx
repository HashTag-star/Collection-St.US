
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

// In the App Router, params are passed as props to the page component
export default function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const orderId = params.id;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/orders">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to Orders</span>
          </Link>
        </Button>
        <h1 className="font-headline text-3xl font-semibold">
          Order Details #{orderId}
        </h1>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Order Information</CardTitle>
          <CardDescription>Detailed information for order #{orderId}.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Full order details, items, customer information, and management options will appear here.</p>
          <p className="mt-4 font-semibold text-primary">Feature Under Development</p>
        </CardContent>
      </Card>
    </div>
  );
}
