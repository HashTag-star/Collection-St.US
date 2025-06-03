import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';

// Mock order data
const orders = [
  { id: 'ORD001', date: '2024-05-01', total: 'GH₵ 150.00', status: 'Delivered' },
  { id: 'ORD002', date: '2024-05-10', total: 'GH₵ 90.50', status: 'Shipped' },
  { id: 'ORD003', date: '2024-05-15', total: 'GH₵ 275.00', status: 'Processing' },
  { id: 'ORD004', date: '2024-04-20', total: 'GH₵ 55.00', status: 'Cancelled' },
];

export default function OrdersPage() {
  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'default'; // bg-primary
      case 'shipped': return 'secondary'; // bg-secondary
      case 'processing': return 'outline'; // outline, text-foreground
      case 'cancelled': return 'destructive'; // bg-destructive
      default: return 'outline';
    }
  };
  
  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-semibold">My Orders</h1>
      {orders.length > 0 ? (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Order History</CardTitle>
            <CardDescription>View details of your past orders.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>{order.total}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(order.status)}>{order.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/account/orders/${order.id}`}>
                          <Eye className="mr-1 h-4 w-4" /> View
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card className="text-center py-12 shadow-lg">
            <CardContent>
                <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <h2 className="font-headline text-2xl font-semibold mb-2">No Orders Yet</h2>
                <p className="text-muted-foreground mb-6">You haven&apos;t placed any orders with us. Start shopping to see your orders here!</p>
                <Button asChild>
                    <Link href="/products">Shop Now</Link>
                </Button>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
