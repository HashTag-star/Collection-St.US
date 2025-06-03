
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, UserPlus } from "lucide-react";

// Mock customer data
const customers = [
  { id: 'CUST001', name: 'Aisha Bello', email: 'aisha.bello@example.com', joinDate: '2023-01-15', totalOrders: 5, totalSpent: 750.00, avatarUrl: 'https://placehold.co/40x40.png', dataAiHint: 'female portrait' },
  { id: 'CUST002', name: 'Chinedu Okoro', email: 'chinedu.okoro@example.com', joinDate: '2023-03-22', totalOrders: 2, totalSpent: 280.50, avatarUrl: 'https://placehold.co/40x40.png', dataAiHint: 'male portrait' },
  { id: 'CUST003', name: 'Fatima Diallo', email: 'fatima.diallo@example.com', joinDate: '2023-05-10', totalOrders: 8, totalSpent: 1200.00, avatarUrl: 'https://placehold.co/40x40.png', dataAiHint: 'woman face' },
  { id: 'CUST004', name: 'Kwame Mensah', email: 'kwame.mensah@example.com', joinDate: '2023-07-01', totalOrders: 1, totalSpent: 95.00, avatarUrl: 'https://placehold.co/40x40.png', dataAiHint: 'man face' },
];

export default function AdminCustomersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-3xl font-semibold">Customers</h1>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" /> Add New Customer
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Customer List</CardTitle>
          <CardDescription>View and manage your customer base.</CardDescription>
        </CardHeader>
        <CardContent>
          {customers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden sm:table-cell">Avatar</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="hidden md:table-cell">Join Date</TableHead>
                  <TableHead className="hidden md:table-cell text-right">Total Spent</TableHead>
                  <TableHead className="text-center">Orders</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="hidden sm:table-cell">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={customer.avatarUrl} alt={customer.name} data-ai-hint={customer.dataAiHint} />
                        <AvatarFallback>{customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell className="hidden md:table-cell">{customer.joinDate}</TableCell>
                    <TableCell className="hidden md:table-cell text-right">GH₵ {customer.totalSpent.toFixed(2)}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">{customer.totalOrders}</Badge>
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
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuItem>View Orders</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
                            Suspend Account
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Users className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="font-headline text-2xl font-semibold mb-2">No Customers Yet</h2>
              <p className="text-muted-foreground">Your customer list will appear here once they start signing up.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Helper Icon (if not already globally available)
function Users(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}
