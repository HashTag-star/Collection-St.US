'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// Mock data - replace with actual cart state management
const cartItems = [
  { id: '1', name: 'Elegant Evening Gown', price: 250.00, imageUrl: 'https://placehold.co/100x150.png', quantity: 1, size: 'M', color: 'Black', dataAiHint: 'evening gown' },
  { id: '2', name: 'Chic Office Blouse', price: 90.00, imageUrl: 'https://placehold.co/100x150.png', quantity: 2, size: 'S', color: 'White', dataAiHint: 'office blouse' },
];

const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
const shipping = 15.00; // Example shipping cost
const total = subtotal + shipping;

export default function CartPage() {
  if (cartItems.length === 0) {
    return (
      <div className="text-center py-20">
        <ShoppingBag className="mx-auto h-24 w-24 text-muted-foreground mb-6" />
        <h1 className="font-headline text-3xl font-semibold mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8">Looks like you haven&apos;t added anything to your cart yet.</p>
        <Button asChild size="lg">
          <Link href="/products">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="font-headline text-4xl font-semibold">Your Shopping Cart</h1>
      
      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <Card key={item.id} className="flex items-start p-4 gap-4 shadow-sm">
              <Image
                src={item.imageUrl}
                alt={item.name}
                width={100}
                height={150}
                className="rounded-md object-cover aspect-[2/3]"
                data-ai-hint={item.dataAiHint}
              />
              <div className="flex-grow space-y-1">
                <h2 className="text-lg font-medium">{item.name}</h2>
                <p className="text-sm text-muted-foreground">
                  Size: {item.size} / Color: {item.color}
                </p>
                <p className="text-md font-semibold text-primary">GH₵ {item.price.toFixed(2)}</p>
                 {/* Quantity Selector */}
                <div className="flex items-center space-x-2 pt-1">
                  <span className="text-sm text-muted-foreground">Quantity:</span>
                  <div className="flex items-center border rounded-md h-8">
                    <Button variant="ghost" size="icon" className="h-full w-8">
                      <Minus className="h-3 w-3" />
                    </Button>
                    <Input
                      type="number"
                      value={item.quantity}
                      readOnly // Or implement state update
                      className="h-full w-10 text-center border-0 focus-visible:ring-0 text-sm px-0"
                    />
                    <Button variant="ghost" size="icon" className="h-full w-8">
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-1">
                <p className="text-lg font-semibold">GH₵ {(item.price * item.quantity).toFixed(2)}</p>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Remove item</span>
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1 sticky top-24">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>GH₵ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>GH₵ {shipping.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-xl font-semibold">
                <span>Total</span>
                <span>GH₵ {total.toFixed(2)}</span>
              </div>
              <p className="text-xs text-muted-foreground">Taxes and duties may apply at checkout.</p>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
