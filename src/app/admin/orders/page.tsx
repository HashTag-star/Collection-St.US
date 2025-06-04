
'use client';

import Link from 'next/link'; // Added Link
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Eye, Truck, CheckCircle, XCircle, ShoppingCart } from 'lucide-react'; // Added ShoppingCart for empty state
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from "@/hooks/use-toast"; // Added useToast

// Mock order data
const orders = [
  { id: 'ORD001', customer: 'Ama Serwaa', date: '2024-05-01', total: 150.00, status: 'Delivered', payment: 'Paid' },
  { id: 'ORD002', customer: 'Kofi Mensah', date: '2024-05-10', total: 90.50, status: 'Shipped', payment: 'Paid' },
  { id: 'ORD003', customer: 'Esi Parker', date: '2024-05-15', total: 275.00, status: 'Processing', payment: 'Pending' },
  { id: 'ORD004', customer: 'Yaw Owusu', date: '2024-05-18', total: 55.00, status: 'Pending Payment', payment: 'Pending' },
  { id: 'ORD005', customer: 'Adwoa Boateng', date: '2024-05-20', total: 120.00, status: 'Cancelled', payment: 'Refunded' },
];

export default function AdminOrdersPage() {
  const { toast } = useToast(); // Initialize toast

  const handleNotImplemented = (feature: string) => {
    toast({
      title: "Coming Soon!",
      description: `${feature} functionality is not yet implemented.`,
    });
  };

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

  const getPaymentBadgeVariant = (payment: string) => {
     switch (payment.toLowerCase()) {
      case 'paid': return 'default';
      case 'pending': return { className: 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-700/30 dark:text-orange-300 dark:border-orange-700' };
      case 'refunded': return 'destructive';
      default: return 'outline';
    }
  }

  // Filter orders for different tabs (example logic)
  const filteredOrders = (statusFilter?: string) => {
    if (!statusFilter || statusFilter === 'all') return orders;
    return orders.filter(order => order.status.toLowerCase() === statusFilter.toLowerCase());
  };


  const renderOrderTable = (orderList: typeof orders, tabName: string) => {
    if (orderList.length === 0) {
      return (
         <Card className="text-center py-12 mt-4">
            <CardContent>
                <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <h2 className="font-headline text-2xl font-semibold mb-2">No Orders Found</h2>
                <p className="text-muted-foreground">There are no orders in the &quot;{tabName}&quot; category.</p>
            </CardContent>
        </Card>
      )
    }
    return (
      <Card className="shadow-lg mt-4">
        <CardHeader>
          <CardTitle className="font-headline">{tabName.charAt(0).toUpperCase() + tabName.slice(1)} Orders</CardTitle>
          <CardDescription>View and manage customer orders in this category.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="hidden md:table-cell">Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Payment</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderList.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell className="hidden md:table-cell">{order.date}</TableCell>
                  <TableCell className="hidden md:table-cell">GH₵ {order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(order.status) as any}>{order.status}</Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant={getPaymentBadgeVariant(order.payment) as any}>
                      {order.payment}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/orders/${order.id}`}>
                            <Eye className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" /> View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleNotImplemented("Mark as Shipped")}>
                          <Truck className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" /> Mark as Shipped
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleNotImplemented("Mark as Delivered")}>
                          <CheckCircle className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" /> Mark as Delivered
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" onClick={() => handleNotImplemented("Cancel Order")}>
                            <XCircle className="mr-2 h-3.5 w-3.5" /> Cancel Order
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }


  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-semibold">Orders</h1>
      <Tabs defaultValue="all">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="shipped">Shipped</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          {renderOrderTable(filteredOrders('all'), 'All')}
        </TabsContent>
        <TabsContent value="processing">
          {renderOrderTable(filteredOrders('processing'), 'Processing')}
        </TabsContent>
        <TabsContent value="shipped">
          {renderOrderTable(filteredOrders('shipped'), 'Shipped')}
        </TabsContent>
        <TabsContent value="delivered">
          {renderOrderTable(filteredOrders('delivered'), 'Delivered')}
        </TabsContent>
        <TabsContent value="cancelled">
          {renderOrderTable(filteredOrders('cancelled'), 'Cancelled')}
        </TabsContent>
      </Tabs>
    </div>
  );
}
