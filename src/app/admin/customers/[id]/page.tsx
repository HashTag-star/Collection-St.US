
'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Edit, Mail, Phone, ShoppingBag, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { getUserById } from '@/lib/user-service';
import type { User } from '@/lib/types';

type ResolvedParamsType = { id: string };
type ParamsPropType = ResolvedParamsType | Promise<ResolvedParamsType>;

function useResolvedParams(paramsProp: ParamsPropType): ResolvedParamsType | null {
  if (typeof (paramsProp as Promise<ResolvedParamsType>)?.then === 'function') {
    return React.use(paramsProp as Promise<ResolvedParamsType>);
  }
  return paramsProp as ResolvedParamsType;
}

export default function AdminCustomerDetailPage({ params: paramsPropInput }: { params: ParamsPropType }) {
  const params = useResolvedParams(paramsPropInput);
  const { toast } = useToast();
  const [customer, setCustomer] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      if (params?.id) {
        setIsLoading(true);
        const fetchedCustomer = await getUserById(params.id);
        if (fetchedCustomer) {
          setCustomer(fetchedCustomer);
        } else {
          toast({ title: "Error", description: "Customer not found.", variant: "destructive" });
          // router.push('/admin/customers'); // Consider redirecting
        }
        setIsLoading(false);
      }
    };
    fetchCustomer();
  }, [params, toast]);

  const getInitials = (name: string = "") => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  }
  
  const handleNotImplemented = (feature: string) => {
    toast({
      title: "Coming Soon!",
      description: `${feature} functionality is not yet implemented.`,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading customer details...</p>
      </div>
    );
  }

  if (!customer) {
    return (
       <div className="space-y-6">
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
            <Link href="/admin/customers">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back to Customers</span>
            </Link>
            </Button>
            <h1 className="font-headline text-3xl font-semibold">Customer Not Found</h1>
        </div>
        <Card className="shadow-lg">
            <CardContent className="py-10 text-center">
                <p className="text-muted-foreground">The customer you are looking for does not exist.</p>
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
            <Link href="/admin/customers">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back to Customers</span>
            </Link>
            </Button>
            <h1 className="font-headline text-3xl font-semibold">
            Customer Profile
            </h1>
        </div>
        <Button variant="outline" onClick={() => handleNotImplemented("Edit Customer Profile")}>
            <Edit className="mr-2 h-4 w-4" /> Edit Profile
        </Button>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
            <Card className="shadow-lg">
                <CardHeader className="items-center text-center">
                    <Avatar className="h-24 w-24 mb-2">
                        <AvatarImage src={customer.avatarUrl || `https://placehold.co/100x100.png?text=${getInitials(customer.fullName)}`} alt={customer.fullName} data-ai-hint="user avatar" />
                        <AvatarFallback>{getInitials(customer.fullName)}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="font-headline text-2xl">{customer.fullName}</CardTitle>
                    <CardDescription>Customer ID: {customer.id}</CardDescription>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                    <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{customer.email}</span>
                    </div>
                    <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>(Phone not available)</span>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button variant="destructive" className="w-full" onClick={() => handleNotImplemented("Suspend Account")}>Suspend Account</Button>
                </CardFooter>
            </Card>
        </div>

        <div className="md:col-span-2">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="font-headline">Order History</CardTitle>
                    <CardDescription>Summary of orders placed by {customer.fullName}.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-10">
                        <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">Order history is not yet available for this customer.</p>
                        <Button variant="link" onClick={() => handleNotImplemented("View Full Order History")}>View Full History (Coming Soon)</Button>
                    </div>
                </CardContent>
            </Card>
            {/* Additional cards for notes, activity, etc. can be added here */}
        </div>
      </div>
    </div>
  );
}
