'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CreditCard, Smartphone } from 'lucide-react';
import Link from 'next/link';

// Mock data
const cartSummary = {
  subtotal: 340.00,
  shipping: 15.00,
  total: 355.00,
  items: [
    { name: 'Elegant Evening Gown', quantity: 1, price: 250.00 },
    { name: 'Chic Office Blouse', quantity: 1, price: 90.00 },
  ],
};

export default function CheckoutPage() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Placing order...');
    // Redirect to order confirmation page
  };

  return (
    <div className="space-y-8">
      <h1 className="font-headline text-4xl font-semibold">Checkout</h1>
      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Shipping and Payment Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="Festus" required />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Us" required />
              </div>
              <div className="sm:col-span-2 grid gap-1.5">
                <Label htmlFor="address">Address</Label>
                <Input id="address" placeholder="123 Main St" required />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="city">City</Label>
                <Input id="city" placeholder="Accra" required />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="phone">Phone Number (for Mobile Money)</Label>
                <Input id="phone" type="tel" placeholder="024xxxxxxx" required />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Payment Method</CardTitle>
              <CardDescription>Select your preferred payment method.</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup defaultValue="mobile-money" className="space-y-2">
                <Label htmlFor="mobile-money" className="flex items-center space-x-3 border rounded-md p-4 hover:bg-muted/50 cursor-pointer has-[:checked]:border-primary has-[:checked]:ring-1 has-[:checked]:ring-primary">
                  <RadioGroupItem value="mobile-money" id="mobile-money" />
                  <Smartphone className="h-5 w-5 text-primary" />
                  <span>Mobile Money (MTN, Vodafone, AirtelTigo)</span>
                </Label>
                <Label htmlFor="card" className="flex items-center space-x-3 border rounded-md p-4 hover:bg-muted/50 cursor-pointer has-[:checked]:border-primary has-[:checked]:ring-1 has-[:checked]:ring-primary">
                  <RadioGroupItem value="card" id="card" />
                  <CreditCard className="h-5 w-5 text-primary" />
                  <span>Credit/Debit Card</span>
                </Label>
              </RadioGroup>
              {/* Conditional fields for card payment can be added here */}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1 sticky top-24">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {cartSummary.items.map(item => (
                <div key={item.name} className="flex justify-between text-sm">
                  <span>{item.name} (x{item.quantity})</span>
                  <span>GH₵ {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>GH₵ {cartSummary.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>GH₵ {cartSummary.shipping.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>GH₵ {cartSummary.total.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter className="flex-col space-y-2">
              <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                Place Order (GH₵ {cartSummary.total.toFixed(2)})
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                By placing your order, you agree to our <Link href="/terms" className="underline hover:text-primary">Terms of Service</Link>.
              </p>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  );
}
