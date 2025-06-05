
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ShoppingBag, Package, CreditCard, MapPin, Loader2 } from 'lucide-react';

// Mock order data - in a real app, this would be fetched
const mockOrders = [
  { 
    id: 'ORD001', 
    date: '2024-05-01', 
    total: 150.00, 
    status: 'Delivered', 
    paymentStatus: 'Paid',
    shippingAddress: '123 Main St, Accra, Ghana',
    items: [
      { id: 'item1', name: 'Elegant Evening Gown', quantity: 1, price: 150.00, imageUrl: 'https://placehold.co/80x100.png', dataAiHint: 'evening gown' },
    ]
  },
  { 
    id: 'ORD002', 
    date: '2024-05-10', 
    total: 90.50, 
    status: 'Shipped', 
    paymentStatus: 'Paid',
    shippingAddress: '456 Palm Ave, Kumasi, Ghana',
    items: [
      { id: 'item2', name: 'Chic Office Blouse', quantity: 1, price: 90.50, imageUrl: 'https://placehold.co/80x100.png', dataAiHint: 'office blouse' },
    ]
  },
];

type ResolvedParamsType = { id: string };
type ParamsPropType = ResolvedParamsType | Promise<ResolvedParamsType>;

function useResolvedParams(paramsProp: ParamsPropType): ResolvedParamsType | null {
  if (typeof (paramsProp as Promise<ResolvedParamsType>)?.then === 'function') {
    return React.use(paramsProp as Promise<ResolvedParamsType>);
  }
  return paramsProp as ResolvedParamsType;
}

export default function CustomerOrderDetailPage({ params: paramsPropInput }: { params: ParamsPropType }) {
  const params = useResolvedParams(paramsPropInput);
  const [order, setOrder] = useState<typeof mockOrders[0] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (params?.id) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        const foundOrder = mockOrders.find(o => o.id === params.id);
        setOrder(foundOrder || null);
        setIsLoading(false);
      }, 500);
    }
  }, [params]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'default';
      case 'shipped': return 'secondary';
      case 'processing': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="space-y-6 text-center">
        <Button variant="outline" size="sm" asChild className="mb-4 inline-flex">
          <Link href="/account/orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to My Orders
          </Link>
        </Button>
        <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="font-headline text-2xl">Order Not Found</h1>
        <p className="text-muted-foreground">We couldn&apos;t find details for this order.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-3xl font-semibold">Order #{order.id}</h1>
        <Button variant="outline" size="sm" asChild>
          <Link href="/account/orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to My Orders
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl">Order Summary</CardTitle>
          <CardDescription>
            Placed on: {new Date(order.date).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span>Status:</span>
            <Badge variant={getStatusBadgeVariant(order.status)}>{order.status}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span>Payment:</span>
            <Badge variant={order.paymentStatus === 'Paid' ? 'default' : 'outline'}>{order.paymentStatus}</Badge>
          </div>

          <Separator />

          <h3 className="font-semibold text-lg flex items-center"><Package className="mr-2 h-5 w-5 text-primary" /> Items Ordered</h3>
          <ul className="space-y-3">
            {order.items.map(item => (
              <li key={item.id} className="flex items-start gap-4 border-b pb-3 last:border-b-0 last:pb-0">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  width={60}
                  height={90}
                  className="rounded-md object-cover aspect-[2/3]"
                  data-ai-hint={item.dataAiHint}
                />
                <div className="flex-grow">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold">GH₵ {(item.price * item.quantity).toFixed(2)}</p>
              </li>
            ))}
          </ul>
          
          <Separator />
          
          <div className="text-right space-y-1">
            <p>Subtotal: <span className="font-medium">GH₵ {order.total.toFixed(2)}</span></p>
            <p>Shipping: <span className="font-medium">GH₵ 0.00</span></p> 
            <p className="text-lg font-bold">Total: <span className="text-primary">GH₵ {order.total.toFixed(2)}</span></p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center"><MapPin className="mr-2 h-5 w-5 text-primary" /> Shipping Information</CardTitle>
        </CardHeader>
        <CardContent>
            <p>{order.shippingAddress}</p>
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center"><CreditCard className="mr-2 h-5 w-5 text-primary" /> Payment Information</CardTitle>
        </CardHeader>
        <CardContent>
            <p>Payment Method: Mobile Money (Mock)</p>
            <p>Status: <span className="font-medium">{order.paymentStatus}</span></p>
        </CardContent>
         <CardFooter className="flex justify-end">
            <Button variant="outline" disabled>Download Invoice (Soon)</Button>
         </CardFooter>
      </Card>
      <p className="text-xs text-muted-foreground text-center">Order details are currently based on mock data.</p>
    </div>
  );
}
