
'use client';

import React, { useState, useEffect, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Save, Store, CreditCard, Truck, Bell, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { getAllSettings, updateMultipleSettings, type AllSettings } from '@/lib/settings-service';

interface SettingsState {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  momoNumber: string;
  vodafoneCash: string;
  enableCardPayments: boolean;
  standardShippingRate: string;
  freeShippingThreshold: string;
  localPickup: boolean;
  pickupAddress: string;
  adminNewOrder: boolean;
  adminLowStock: boolean;
  customerOrderConfirmation: boolean;
  customerShippingUpdate: boolean;
  customerOrderDelivered: boolean;
  notificationEmail: string;
}

const initialSettingsState: SettingsState = {
  storeName: '',
  storeEmail: '',
  storePhone: '',
  storeAddress: '',
  momoNumber: '',
  vodafoneCash: '',
  enableCardPayments: false,
  standardShippingRate: '',
  freeShippingThreshold: '',
  localPickup: false,
  pickupAddress: '',
  adminNewOrder: true,
  adminLowStock: false,
  customerOrderConfirmation: true,
  customerShippingUpdate: true,
  customerOrderDelivered: false,
  notificationEmail: '',
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SettingsState>(initialSettingsState);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        const fetchedDbSettings = await getAllSettings();
        
        setSettings(prev => ({
            ...prev, // Keep any defaults not in DB
            storeName: String(fetchedDbSettings.storeName ?? initialSettingsState.storeName),
            storeEmail: String(fetchedDbSettings.storeEmail ?? initialSettingsState.storeEmail),
            storePhone: String(fetchedDbSettings.storePhone ?? initialSettingsState.storePhone),
            storeAddress: String(fetchedDbSettings.storeAddress ?? initialSettingsState.storeAddress),
            momoNumber: String(fetchedDbSettings.momoNumber ?? initialSettingsState.momoNumber),
            vodafoneCash: String(fetchedDbSettings.vodafoneCash ?? initialSettingsState.vodafoneCash),
            enableCardPayments: Boolean(fetchedDbSettings.enableCardPayments ?? initialSettingsState.enableCardPayments),
            standardShippingRate: String(fetchedDbSettings.standardShippingRate ?? initialSettingsState.standardShippingRate),
            freeShippingThreshold: String(fetchedDbSettings.freeShippingThreshold ?? initialSettingsState.freeShippingThreshold),
            localPickup: Boolean(fetchedDbSettings.localPickup ?? initialSettingsState.localPickup),
            pickupAddress: String(fetchedDbSettings.pickupAddress ?? initialSettingsState.pickupAddress),
            adminNewOrder: Boolean(fetchedDbSettings.adminNewOrder ?? initialSettingsState.adminNewOrder),
            adminLowStock: Boolean(fetchedDbSettings.adminLowStock ?? initialSettingsState.adminLowStock),
            customerOrderConfirmation: Boolean(fetchedDbSettings.customerOrderConfirmation ?? initialSettingsState.customerOrderConfirmation),
            customerShippingUpdate: Boolean(fetchedDbSettings.customerShippingUpdate ?? initialSettingsState.customerShippingUpdate),
            customerOrderDelivered: Boolean(fetchedDbSettings.customerOrderDelivered ?? initialSettingsState.customerOrderDelivered),
            notificationEmail: String(fetchedDbSettings.notificationEmail ?? initialSettingsState.notificationEmail),
        }));

      } catch (error) {
        console.error("Failed to fetch settings:", error);
        toast({ title: "Error", description: "Could not load settings.", variant: "destructive" });
      }
      setIsLoading(false);
    };
    fetchSettings();
  }, [toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setSettings(prev => ({ ...prev, [id]: value }));
  };

  const handleSwitchChange = (id: keyof SettingsState, checked: boolean) => {
    setSettings(prev => ({ ...prev, [id]: checked }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>, section: string, settingsToSave: Partial<SettingsState>) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      // Filter out any undefined values before saving
      const validSettingsToSave: Record<string, string | boolean> = {};
      for (const [key, value] of Object.entries(settingsToSave)) {
        if (value !== undefined) {
          validSettingsToSave[key] = value;
        }
      }
      if (Object.keys(validSettingsToSave).length > 0) {
        await updateMultipleSettings(validSettingsToSave);
        toast({ title: "Settings Saved", description: `${section} settings have been updated.` });
      } else {
        toast({ title: "No Changes", description: `No changes to save for ${section}.` });
      }
    } catch (error) {
      console.error(`Failed to save ${section} settings:`, error);
      toast({ title: "Error", description: `Could not save ${section} settings.`, variant: "destructive" });
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading settings...</p>
      </div>
    );
  }

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
            <form onSubmit={(e) => handleSubmit(e, 'Store Information', {
              storeName: settings.storeName,
              storeEmail: settings.storeEmail,
              storePhone: settings.storePhone,
              storeAddress: settings.storeAddress,
            })}>
              <CardHeader>
                <CardTitle className="font-headline">Store Information</CardTitle>
                <CardDescription>Manage your store&apos;s basic details and contact information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input id="storeName" value={settings.storeName} onChange={handleInputChange} disabled={isSaving} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="storeEmail">Contact Email</Label>
                  <Input id="storeEmail" type="email" value={settings.storeEmail} onChange={handleInputChange} disabled={isSaving} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="storePhone">Phone Number</Label>
                  <Input id="storePhone" type="tel" value={settings.storePhone} onChange={handleInputChange} disabled={isSaving} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="storeAddress">Store Address</Label>
                  <Textarea id="storeAddress" value={settings.storeAddress} onChange={handleInputChange} disabled={isSaving} />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="ml-auto" disabled={isSaving}>
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save Store Info
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <Card className="shadow-lg">
            <form onSubmit={(e) => handleSubmit(e, 'Payment Gateway', {
              momoNumber: settings.momoNumber,
              vodafoneCash: settings.vodafoneCash,
              enableCardPayments: settings.enableCardPayments,
            })}>
              <CardHeader>
                <CardTitle className="font-headline">Payment Gateway</CardTitle>
                <CardDescription>Configure your payment processing options.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="momoNumber">Mobile Money Number (MTN)</Label>
                  <Input id="momoNumber" value={settings.momoNumber} onChange={handleInputChange} placeholder="024xxxxxxx" disabled={isSaving} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="vodafoneCash">Mobile Money Number (Vodafone Cash)</Label>
                  <Input id="vodafoneCash" value={settings.vodafoneCash} onChange={handleInputChange} placeholder="050xxxxxxx" disabled={isSaving} />
                </div>
                 <div className="flex items-center space-x-2">
                    <Switch id="enableCardPayments" checked={settings.enableCardPayments} onCheckedChange={(checked) => handleSwitchChange('enableCardPayments', checked)} disabled={isSaving} />
                    <Label htmlFor="enableCardPayments">Enable Credit/Debit Card Payments</Label>
                </div>
                <CardDescription className="text-xs">Card payment integration details would go here (e.g., API keys for Paystack/Flutterwave).</CardDescription>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="ml-auto" disabled={isSaving}>
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                   Save Payment Settings
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="shipping">
          <Card className="shadow-lg">
            <form onSubmit={(e) => handleSubmit(e, 'Shipping Options', {
              standardShippingRate: settings.standardShippingRate,
              freeShippingThreshold: settings.freeShippingThreshold,
              localPickup: settings.localPickup,
              pickupAddress: settings.pickupAddress,
            })}>
              <CardHeader>
                <CardTitle className="font-headline">Shipping Options</CardTitle>
                <CardDescription>Set up your shipping rates and zones.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="standardShippingRate">Standard Shipping Rate (GH₵)</Label>
                  <Input id="standardShippingRate" type="number" value={settings.standardShippingRate} onChange={handleInputChange} disabled={isSaving} />
                </div>
                 <div className="grid gap-2">
                  <Label htmlFor="freeShippingThreshold">Free Shipping Threshold (GH₵)</Label>
                  <Input id="freeShippingThreshold" type="number" value={settings.freeShippingThreshold} onChange={handleInputChange} placeholder="e.g., 500.00 (leave blank if none)" disabled={isSaving} />
                </div>
                <div className="flex items-center space-x-2">
                    <Switch id="localPickup" checked={settings.localPickup} onCheckedChange={(checked) => handleSwitchChange('localPickup', checked)} disabled={isSaving} />
                    <Label htmlFor="localPickup">Enable Local Pickup</Label>
                </div>
                 <div className="grid gap-2">
                  <Label htmlFor="pickupAddress">Local Pickup Address</Label>
                  <Textarea id="pickupAddress" value={settings.pickupAddress} onChange={handleInputChange} placeholder="Enter pickup address if enabled" disabled={isSaving || !settings.localPickup} />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="ml-auto" disabled={isSaving}>
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save Shipping Settings
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
            <Card className="shadow-lg">
                <form onSubmit={(e) => handleSubmit(e, 'Notification Settings', {
                    adminNewOrder: settings.adminNewOrder,
                    adminLowStock: settings.adminLowStock,
                    customerOrderConfirmation: settings.customerOrderConfirmation,
                    customerShippingUpdate: settings.customerShippingUpdate,
                    customerOrderDelivered: settings.customerOrderDelivered,
                    notificationEmail: settings.notificationEmail,
                })}>
                    <CardHeader>
                        <CardTitle className="font-headline">Notification Settings</CardTitle>
                        <CardDescription>Manage email notifications for admins and customers.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium mb-2">Admin Notifications</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="adminNewOrder" className="flex-grow">New Order Received</Label>
                                    <Switch id="adminNewOrder" checked={settings.adminNewOrder} onCheckedChange={(checked) => handleSwitchChange('adminNewOrder', checked)} disabled={isSaving}/>
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="adminLowStock" className="flex-grow">Low Stock Alerts</Label>
                                    <Switch id="adminLowStock" checked={settings.adminLowStock} onCheckedChange={(checked) => handleSwitchChange('adminLowStock', checked)} disabled={isSaving}/>
                                </div>
                            </div>
                        </div>
                         <div>
                            <h3 className="text-lg font-medium mb-2">Customer Notifications</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="customerOrderConfirmation" className="flex-grow">Order Confirmation</Label>
                                    <Switch id="customerOrderConfirmation" checked={settings.customerOrderConfirmation} onCheckedChange={(checked) => handleSwitchChange('customerOrderConfirmation', checked)} disabled={isSaving}/>
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="customerShippingUpdate" className="flex-grow">Shipping Updates</Label>
                                    <Switch id="customerShippingUpdate" checked={settings.customerShippingUpdate} onCheckedChange={(checked) => handleSwitchChange('customerShippingUpdate', checked)} disabled={isSaving}/>
                                </div>
                                 <div className="flex items-center justify-between">
                                    <Label htmlFor="customerOrderDelivered" className="flex-grow">Order Delivered</Label>
                                    <Switch id="customerOrderDelivered" checked={settings.customerOrderDelivered} onCheckedChange={(checked) => handleSwitchChange('customerOrderDelivered', checked)} disabled={isSaving}/>
                                </div>
                            </div>
                        </div>
                         <div className="grid gap-2">
                            <Label htmlFor="notificationEmail">Admin Notification Email</Label>
                            <Input id="notificationEmail" type="email" value={settings.notificationEmail} onChange={handleInputChange} disabled={isSaving}/>
                            <p className="text-xs text-muted-foreground">Emails for admin notifications will be sent to this address.</p>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="ml-auto" disabled={isSaving}>
                            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Save Notification Settings
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
