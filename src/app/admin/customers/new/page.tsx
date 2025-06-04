
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

export default function AdminNewCustomerPage() {
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
          Add New Customer
        </h1>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">New Customer Form</CardTitle>
          <CardDescription>Enter the details for the new customer account.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">A form to add new customer details will appear here.</p>
          <p className="mt-4 font-semibold text-primary">Feature Under Development</p>
        </CardContent>
      </Card>
    </div>
  );
}
