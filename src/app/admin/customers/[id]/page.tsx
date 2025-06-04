
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import React from 'react'; // Import React

// Define the expected type for resolved params
type ResolvedParamsType = { id: string };
// Define the prop type, which could be the resolved type or a Promise of it
type ParamsPropType = ResolvedParamsType | Promise<ResolvedParamsType>;

// Custom hook to resolve params if they are a Promise
function useResolvedParams(paramsProp: ParamsPropType): ResolvedParamsType | null {
  // Check if paramsProp is a promise
  if (typeof (paramsProp as Promise<ResolvedParamsType>)?.then === 'function') {
    // If it's a promise, use React.use to unwrap it.
    // This will suspend the component until the promise resolves.
    return React.use(paramsProp as Promise<ResolvedParamsType>);
  }
  // If it's not a promise, return it as is.
  return paramsProp as ResolvedParamsType;
}

// In the App Router, params are passed as props to the page component
export default function AdminCustomerDetailPage({ params: paramsPropInput }: { params: ParamsPropType }) {
  const params = useResolvedParams(paramsPropInput);

  if (!params) {
    // This case might occur if the promise is still resolving or if it resolved to null/undefined.
    // Or if React.use suspends, this part of the code won't be reached until resolution.
    return (
      <div className="flex justify-center items-center h-full">
        <p>Loading customer details...</p>
      </div>
    );
  }
  const customerId = params.id;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/customers">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to Customers</span>
          </Link>
        </Button>
        <h1 className="font-headline text-3xl font-semibold">
          Customer Profile #{customerId}
        </h1>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Customer Information</CardTitle>
          <CardDescription>Detailed profile for customer #{customerId}.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Full customer details, order history, communication logs, and management options will appear here.</p>
          <p className="mt-4 font-semibold text-primary">Feature Under Development</p>
        </CardContent>
      </Card>
    </div>
  );
}
