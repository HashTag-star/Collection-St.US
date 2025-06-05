
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Save, Bell, Shield, Palette, Loader2 } from 'lucide-react';
import React, { useState } from 'react';

export default function AccountSettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState({
    promotions: true,
    orderUpdates: true,
    newsletter: false,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleNotificationChange = (id: keyof typeof emailNotifications, checked: boolean) => {
    setEmailNotifications(prev => ({ ...prev, [id]: checked }));
  };
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Settings saved (mock):", emailNotifications);
    setIsSaving(false);
    // Add toast message here in a real app
  };

  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-semibold">Account Settings</h1>
      <form onSubmit={handleSubmit}>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline flex items-center"><Bell className="mr-2 h-5 w-5 text-primary" /> Notification Preferences</CardTitle>
            <CardDescription>Manage how you receive communications from us.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-md">
              <Label htmlFor="promotions" className="flex-grow cursor-pointer">Promotions and Special Offers</Label>
              <Switch id="promotions" checked={emailNotifications.promotions} onCheckedChange={(checked) => handleNotificationChange('promotions', checked)} disabled={isSaving}/>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-md">
              <Label htmlFor="orderUpdates" className="flex-grow cursor-pointer">Order Updates (Confirmation, Shipping)</Label>
              <Switch id="orderUpdates" checked={emailNotifications.orderUpdates} onCheckedChange={(checked) => handleNotificationChange('orderUpdates', checked)} disabled={isSaving}/>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-md">
              <Label htmlFor="newsletter" className="flex-grow cursor-pointer">Subscribe to Newsletter</Label>
              <Switch id="newsletter" checked={emailNotifications.newsletter} onCheckedChange={(checked) => handleNotificationChange('newsletter', checked)} disabled={isSaving}/>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="ml-auto" disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Preferences
            </Button>
          </CardFooter>
        </Card>
      </form>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center"><Shield className="mr-2 h-5 w-5 text-primary" /> Privacy & Security</CardTitle>
          <CardDescription>Manage your account security settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <Button variant="outline" disabled>Manage Two-Factor Auth (Soon)</Button>
            <Button variant="outline" disabled>View Login History (Soon)</Button>
        </CardContent>
      </Card>
        <p className="text-xs text-muted-foreground text-center">Account settings functionality is currently under development. Changes made on this page are not persisted.</p>
    </div>
  );
}
