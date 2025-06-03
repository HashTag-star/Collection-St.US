import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Eye, Truck, CheckCircle, XCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock order data
const orders = [
  { id: 'ORD001', customer: 'Ama Serwaa', date: '2024-05-01', total: 150.00, status: 'Delivered', payment: 'Paid' },
  { id: 'ORD002', customer: 'Kofi Mensah', date: '2024-05-10', total: 90.50, status: 'Shipped', payment: 'Paid' },
  { id: 'ORD003', customer: 'Esi Parker', date: '2024-05-15', total: 275.00, status: 'Processing', payment: 'Pending' },
  { id: 'ORD004', customer: 'Yaw Owusu', date: '2024-05-18', total: 55.00, status: 'Pending Payment', payment: 'Pending' },
  { id: 'ORD005', customer: 'Adwoa Boateng', date: '2024-05-20', total: 120.00, status: 'Cancelled', payment: 'Refunded' },
];

export default function AdminOrdersPage() {
    const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'default';
      case 'shipped': return 'secondary';
      case 'processing': return 'outline';
      case 'pending payment': return { className: 'bg-yellow-100 text-yellow-800 border-yellow-300' };
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

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
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline">All Orders</CardTitle>
              <CardDescription>View and manage all customer orders.</CardDescription>
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
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell className="hidden md:table-cell">{order.date}</TableCell>
                      <TableCell className="hidden md:table-cell">GH₵ {order.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(order.status) as any}>{order.status}</Badge>
                      </TableCell>
                       <TableCell className="hidden sm:table-cell">
                        <Badge variant={order.payment === 'Paid' ? 'default' : (order.payment === 'Pending' ? { className: 'bg-orange-100 text-orange-800 border-orange-300' } : 'destructive') as any}>
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
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Truck className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" /> Mark as Shipped
                            </DropdownMenuItem>
                             <DropdownMenuItem>
                              <CheckCircle className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" /> Mark as Delivered
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
                                <XCircle className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" /> Cancel Order
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
        </TabsContent>
        {/* Add TabsContent for other statuses here */}
      </Tabs>
       {orders.length === 0 && (
         <Card className="text-center py-12">
            <CardContent>
                <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <h2 className="font-headline text-2xl font-semibold mb-2">No Orders Found</h2>
                <p className="text-muted-foreground">There are currently no orders to display.</p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
