
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Save, Store, CreditCard, Truck, Bell } from 'lucide-react';

export default function AdminSettingsPage() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>, section: string) => {
    event.preventDefault();
    console.log(`${section} settings saved`);
    // Add toast notification here
  };

  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-semibold">Settings</h1>

      <Tabs defaultValue="store-info" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
          <TabsTrigger value="store-info"><Store className="mr-2 h-4 w-4 hidden sm:inline-block" />Store Info</TabsTrigger>
          <TabsTrigger value="payment"><CreditCard className="mr-2 h-4 w-4 hidden sm:inline-block" />Payment</TabsTrigger>
          <TabsTrigger value="shipping"><Truck className="mr-2 h-4 w-4 hidden sm:inline-block" />Shipping</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="mr-2 h-4 w-4 hidden sm:inline-block" />Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="store-info">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline">Store Information</CardTitle>
              <CardDescription>Manage your store&apos;s basic details and contact information.</CardDescription>
            </CardHeader>
            <form onSubmit={(e) => handleSubmit(e, 'Store Information')}>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input id="storeName" defaultValue="St.Us Collections" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="storeEmail">Contact Email</Label>
                  <Input id="storeEmail" type="email" defaultValue="support@stus.com" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="storePhone">Phone Number</Label>
                  <Input id="storePhone" type="tel" defaultValue="+233 24 123 4567" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="storeAddress">Store Address</Label>
                  <Textarea id="storeAddress" defaultValue="123 Fashion Ave, Accra, Ghana" />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="ml-auto">
                  <Save className="mr-2 h-4 w-4" /> Save Store Info
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline">Payment Gateway</CardTitle>
              <CardDescription>Configure your payment processing options.</CardDescription>
            </CardHeader>
             <form onSubmit={(e) => handleSubmit(e, 'Payment Gateway')}>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="momoNumber">Mobile Money Number (MTN)</Label>
                  <Input id="momoNumber" placeholder="024xxxxxxx" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="vodafoneCash">Mobile Money Number (Vodafone Cash)</Label>
                  <Input id="vodafoneCash" placeholder="050xxxxxxx" />
                </div>
                 <div className="flex items-center space-x-2">
                    <Switch id="enableCardPayments" />
                    <Label htmlFor="enableCardPayments">Enable Credit/Debit Card Payments</Label>
                </div>
                <CardDescription className="text-xs">Card payment integration details would go here (e.g., API keys for Paystack/Flutterwave).</CardDescription>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="ml-auto">
                  <Save className="mr-2 h-4 w-4" /> Save Payment Settings
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="shipping">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline">Shipping Options</CardTitle>
              <CardDescription>Set up your shipping rates and zones.</CardDescription>
            </CardHeader>
            <form onSubmit={(e) => handleSubmit(e, 'Shipping Options')}>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="standardShippingRate">Standard Shipping Rate (GH₵)</Label>
                  <Input id="standardShippingRate" type="number" defaultValue="15.00" />
                </div>
                 <div className="grid gap-2">
                  <Label htmlFor="freeShippingThreshold">Free Shipping Threshold (GH₵)</Label>
                  <Input id="freeShippingThreshold" type="number" placeholder="e.g., 500.00 (leave blank if none)" />
                </div>
                <div className="flex items-center space-x-2">
                    <Switch id="localPickup" />
                    <Label htmlFor="localPickup">Enable Local Pickup</Label>
                </div>
                 <div className="grid gap-2">
                  <Label htmlFor="pickupAddress">Local Pickup Address</Label>
                  <Textarea id="pickupAddress" placeholder="Enter pickup address if enabled" />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="ml-auto">
                  <Save className="mr-2 h-4 w-4" /> Save Shipping Settings
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="font-headline">Notification Settings</CardTitle>
                    <CardDescription>Manage email notifications for admins and customers.</CardDescription>
                </CardHeader>
                <form onSubmit={(e) => handleSubmit(e, 'Notification Settings')}>
                    <CardContent className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium mb-2">Admin Notifications</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="adminNewOrder" className="flex-grow">New Order Received</Label>
                                    <Switch id="adminNewOrder" defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="adminLowStock" className="flex-grow">Low Stock Alerts</Label>
                                    <Switch id="adminLowStock" />
                                </div>
                            </div>
                        </div>
                         <div>
                            <h3 className="text-lg font-medium mb-2">Customer Notifications</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="customerOrderConfirmation" className="flex-grow">Order Confirmation</Label>
                                    <Switch id="customerOrderConfirmation" defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="customerShippingUpdate" className="flex-grow">Shipping Updates</Label>
                                    <Switch id="customerShippingUpdate" defaultChecked />
                                </div>
                                 <div className="flex items-center justify-between">
                                    <Label htmlFor="customerOrderDelivered" className="flex-grow">Order Delivered</Label>
                                    <Switch id="customerOrderDelivered" />
                                </div>
                            </div>
                        </div>
                         <div className="grid gap-2">
                            <Label htmlFor="notificationEmail">Admin Notification Email</Label>
                            <Input id="notificationEmail" type="email" defaultValue="admin@stus.com" />
                            <p className="text-xs text-muted-foreground">Emails for admin notifications will be sent to this address.</p>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="ml-auto">
                            <Save className="mr-2 h-4 w-4" /> Save Notification Settings
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

