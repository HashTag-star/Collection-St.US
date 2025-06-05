
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, PlusCircle } from 'lucide-react';
import Link from 'next/link';

// Mock addresses
const addresses = [
  { id: '1', type: 'Home', line1: '123 Main Street', city: 'Accra', default: true },
  { id: '2', type: 'Work', line1: '456 Business Ave', city: 'Kumasi', default: false },
];

export default function AddressesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-3xl font-semibold">My Addresses</h1>
        <Button disabled>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Address (Soon)
        </Button>
      </div>

      {addresses.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {addresses.map((address) => (
            <Card key={address.id} className={`shadow-lg ${address.default ? 'border-primary ring-1 ring-primary' : ''}`}>
              <CardHeader>
                <CardTitle className="font-headline flex items-center justify-between">
                  {address.type}
                  {address.default && <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">Default</span>}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <p>{address.line1}</p>
                <p>{address.city}</p>
              </CardContent>
              <CardContent className="flex gap-2 pt-0">
                <Button variant="outline" size="sm" disabled>Edit (Soon)</Button>
                <Button variant="outline" size="sm" disabled className="text-destructive hover:text-destructive">
                  Remove (Soon)
                </Button>
                {!address.default && <Button variant="link" size="sm" disabled>Set as Default (Soon)</Button>}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12 shadow-lg">
          <CardContent>
            <MapPin className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="font-headline text-2xl font-semibold mb-2">No Addresses Saved</h2>
            <p className="text-muted-foreground mb-6">
              Add your shipping addresses for faster checkout.
            </p>
            <Button disabled>Add New Address (Soon)</Button>
          </CardContent>
        </Card>
      )}
      <p className="text-xs text-muted-foreground text-center">Address management is currently under development. This page uses mock data.</p>
    </div>
  );
}
