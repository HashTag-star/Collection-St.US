
'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, FileText, User, MapPin, CreditCard, Package, Printer, Edit, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/hooks/use-toast";

// Define a simple Order type for mock data
interface MockOrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  imageUrl: string;
  dataAiHint: string;
}

interface MockOrder {
  id: string;
  date: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Pending Payment';
  paymentStatus: 'Paid' | 'Pending' | 'Refunded';
  items: MockOrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
}

// Extended Mock order data matching the one in orders/page.tsx for consistency
const mockOrdersData: MockOrder[] = [
  { id: 'ORD001', customerName: 'Ama Serwaa', customerEmail: 'ama@example.com', shippingAddress: '123 Flower St, Accra', date: '2024-05-01', total: 150.00, status: 'Delivered', paymentStatus: 'Paid', items: [{id: 'P1', name: 'Elegant Gown', quantity: 1, price: 150, imageUrl: 'https://placehold.co/80x80.png', dataAiHint: 'gown product'}], subtotal: 150, shippingCost: 0 },
  { id: 'ORD002', customerName: 'Kofi Mensah', customerEmail: 'kofi@example.com', shippingAddress: '456 Palm Ave, Kumasi', date: '2024-05-10', total: 90.50, status: 'Shipped', paymentStatus: 'Paid', items: [{id: 'P2', name: 'Office Blouse', quantity: 1, price: 75.50, imageUrl: 'https://placehold.co/80x80.png', dataAiHint: 'blouse product'}, {id: 'P3', name: 'Silk Scarf', quantity: 1, price: 15, imageUrl: 'https://placehold.co/80x80.png', dataAiHint: 'scarf product'}], subtotal: 75.50, shippingCost: 15.00 },
  { id: 'ORD003', customerName: 'Esi Parker', customerEmail: 'esi@example.com', shippingAddress: '789 Baobab Rd, Takoradi', date: '2024-05-15', total: 275.00, status: 'Processing', paymentStatus: 'Pending', items: [{id: 'P4', name: 'Leather Handbag', quantity: 1, price: 275, imageUrl: 'https://placehold.co/80x80.png', dataAiHint: 'handbag product'}], subtotal: 275, shippingCost: 0 },
  { id: 'ORD004', customerName: 'Yaw Owusu', customerEmail: 'yaw@example.com', shippingAddress: '101 Star St, Cape Coast', date: '2024-05-18', total: 55.00, status: 'Pending Payment', paymentStatus: 'Pending', items: [{id: 'P5', name: 'Casual T-Shirt', quantity: 2, price: 27.50, imageUrl: 'https://placehold.co/80x80.png', dataAiHint: 'shirt product'}], subtotal: 55, shippingCost: 0 },
  { id: 'ORD005', customerName: 'Adwoa Boateng', customerEmail: 'adwoa@example.com', shippingAddress: '222 Moon Cres, Tema', date: '2024-05-20', total: 120.00, status: 'Cancelled', paymentStatus: 'Refunded', items: [{id: 'P6', name: 'Summer Dress', quantity: 1, price: 120, imageUrl: 'https://placehold.co/80x80.png', dataAiHint: 'dress product'}], subtotal: 120, shippingCost: 0 },
];


type ResolvedParamsType = { id: string };
type ParamsPropType = ResolvedParamsType | Promise<ResolvedParamsType>;

function useResolvedParams(paramsProp: ParamsPropType): ResolvedParamsType | null {
  if (typeof (paramsProp as Promise<ResolvedParamsType>)?.then === 'function') {
    return React.use(paramsProp as Promise<ResolvedParamsType>);
  }
  return paramsProp as ResolvedParamsType;
}

export default function AdminOrderDetailPage({ params: paramsPropInput }: { params: ParamsPropType }) {
  const params = useResolvedParams(paramsPropInput);
  const { toast } = useToast();
  const [order, setOrder] = useState<MockOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    setIsLoading(true);
    if (params?.id) {
      // Simulate fetching order details
      const foundOrder = mockOrdersData.find(o => o.id === params.id);
      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        // toast({ title: "Order Not Found", description: `Order with ID ${params.id} could not be found in mock data.`, variant: "destructive" });
        setOrder(null); // Set to null if not found
      }
    }
    // Simulate loading delay
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [params, toast]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'default';
      case 'shipped': return 'secondary';
      case 'processing': return 'outline';
      case 'pending payment': return { className: 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-700/30 dark:text-yellow-300 dark:border-yellow-700' };
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  const getPaymentBadgeVariant = (paymentStatus: string) => {
     switch (paymentStatus.toLowerCase()) {
      case 'paid': return 'default';
      case 'pending': return { className: 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-700/30 dark:text-orange-300 dark:border-orange-700' };
      case 'refunded': return 'destructive';
      default: return 'outline';
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
            <Link href="/admin/orders">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back to Orders</span>
            </Link>
            </Button>
            <h1 className="font-headline text-3xl font-semibold">Order Not Found</h1>
        </div>
        <Card className="shadow-lg">
            <CardContent className="py-10 text-center">
                <p className="text-muted-foreground">The order you are looking for (ID: {params?.id}) does not exist in the current dataset.</p>
                <p className="mt-2 text-xs">This page currently uses mock data.</p>
            </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
            <Link href="/admin/orders">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back to Orders</span>
            </Link>
            </Button>
            <h1 className="font-headline text-3xl font-semibold">
            Order #{order.id}
            </h1>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" onClick={() => toast({title: "Coming Soon", description: "Order editing is not yet implemented."})}>
                <Edit className="mr-2 h-4 w-4" /> Edit Order
            </Button>
            <Button variant="outline" onClick={() => toast({title: "Coming Soon", description: "Invoice printing is not yet implemented."})}>
                <Printer className="mr-2 h-4 w-4" /> Print Invoice
            </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Order Details & Items */}
        <div className="md:col-span-2 space-y-6">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="font-headline flex items-center justify-between">
                        <span>Order Items</span>
                        <Badge variant={getStatusBadgeVariant(order.status) as any}>{order.status}</Badge>
                    </CardTitle>
                    <CardDescription>Date: {order.date}</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3">
                        {order.items.map(item => (
                            <li key={item.id} className="flex items-center gap-4 border-b pb-3 last:border-b-0 last:pb-0">
                                <img src={item.imageUrl} alt={item.name} data-ai-hint={item.dataAiHint} className="h-16 w-16 rounded-md object-cover"/>
                                <div className="flex-grow">
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                </div>
                                <p className="font-semibold">GH₵ {(item.price * item.quantity).toFixed(2)}</p>
                            </li>
                        ))}
                    </ul>
                </CardContent>
                <CardFooter className="flex justify-end pt-4 border-t">
                    <div className="text-right space-y-1">
                        <p>Subtotal: <span className="font-medium">GH₵ {order.subtotal.toFixed(2)}</span></p>
                        <p>Shipping: <span className="font-medium">GH₵ {order.shippingCost.toFixed(2)}</span></p>
                        <p className="text-lg font-bold">Total: <span className="text-primary">GH₵ {order.total.toFixed(2)}</span></p>
                    </div>
                </CardFooter>
            </Card>
        </div>
        
        {/* Customer & Shipping Info */}
        <div className="md:col-span-1 space-y-6">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="font-headline flex items-center"><User className="mr-2 h-5 w-5 text-primary" /> Customer</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 text-sm">
                    <p className="font-medium">{order.customerName}</p>
                    <p className="text-muted-foreground">{order.customerEmail}</p>
                </CardContent>
            </Card>
             <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="font-headline flex items-center"><MapPin className="mr-2 h-5 w-5 text-primary" /> Shipping Address</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                    <p>{order.shippingAddress}</p>
                </CardContent>
            </Card>
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="font-headline flex items-center"><CreditCard className="mr-2 h-5 w-5 text-primary" /> Payment</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                    <span className="text-sm">Payment Status:</span>
                    <Badge variant={getPaymentBadgeVariant(order.paymentStatus) as any}>{order.paymentStatus}</Badge>
                </CardContent>
                 <CardFooter>
                     <Button className="w-full" variant="outline" onClick={() => toast({title: "Coming Soon!", description: "Payment management not implemented."})}>Manage Payment</Button>
                 </CardFooter>
            </Card>
        </div>
      </div>
      <p className="text-xs text-muted-foreground text-center mt-4">Order details are currently based on mock data.</p>
    </div>
  );
}
