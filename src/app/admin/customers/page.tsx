
'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, UserPlus, Users as UsersIconLucide, Loader2, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getAllUsers, deleteUserById } from '@/lib/user-service';
import type { User } from '@/lib/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AdminCustomersPage() {
  const { toast } = useToast();
  const [customers, setCustomers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      setIsLoading(true);
      try {
        const fetchedCustomers = await getAllUsers();
        setCustomers(fetchedCustomers);
      } catch (error) {
        console.error("Failed to fetch customers:", error);
        toast({ title: "Error", description: "Could not load customers.", variant: "destructive" });
      }
      setIsLoading(false);
    };
    fetchCustomers();
  }, [toast]);
  
  const getInitials = (name: string = "") => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  }

  const handleNotImplemented = (feature: string) => {
    toast({
      title: "Coming Soon!",
      description: `${feature} functionality is not yet implemented.`,
    });
  };

  const handleDeleteClick = (customer: User) => {
    setCustomerToDelete(customer);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!customerToDelete) return;
    setIsDeleting(true);
    const { success, error } = await deleteUserById(customerToDelete.id);
    setIsDeleting(false);
    setShowDeleteDialog(false);

    if (success) {
      toast({ title: "Customer Deleted", description: `${customerToDelete.fullName} has been removed.` });
      setCustomers(prevCustomers => prevCustomers.filter(c => c.id !== customerToDelete.id));
    } else {
      toast({ title: "Error", description: error || "Could not delete customer.", variant: "destructive" });
    }
    setCustomerToDelete(null);
  };


  if (isLoading) {
     return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-headline text-3xl font-semibold">Customers</h1>
          <Button asChild>
            <Link href="/admin/customers/new">
              <UserPlus className="mr-2 h-4 w-4" /> Add New Customer
            </Link>
          </Button>
        </div>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Customer List</CardTitle>
            <CardDescription>View and manage your customer base.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-2">Loading customers...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-3xl font-semibold">Customers</h1>
        <Button asChild>
          <Link href="/admin/customers/new">
            <UserPlus className="mr-2 h-4 w-4" /> Add New Customer
          </Link>
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
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="hidden sm:table-cell">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={customer.avatarUrl || `https://placehold.co/40x40.png?text=${getInitials(customer.fullName)}`} alt={customer.fullName} data-ai-hint="user avatar" />
                        <AvatarFallback>{getInitials(customer.fullName)}</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">{customer.fullName}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">Active</Badge> {/* Placeholder status */}
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
                            <Link href={`/admin/customers/${customer.id}`}>View Profile</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleNotImplemented(`Viewing orders for ${customer.fullName}`)}>
                            View Orders
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive focus:bg-destructive/10"
                            onClick={() => handleDeleteClick(customer)}
                          >
                            <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete Customer
                          </DropdownMenuItem>
                           <DropdownMenuItem 
                            className="text-orange-600 focus:text-orange-600 focus:bg-orange-500/10"
                            onClick={() => handleNotImplemented(`Suspending account for ${customer.fullName}`)}
                          >
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
              <UsersIconLucide className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="font-headline text-2xl font-semibold mb-2">No Customers Yet</h2>
              <p className="text-muted-foreground">Your customer list will appear here once they start signing up or are added.</p>
            </div>
          )}
        </CardContent>
      </Card>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the customer
              &quot;{customerToDelete?.fullName}&quot; and their account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCustomerToDelete(null)} disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
              {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Delete Customer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
