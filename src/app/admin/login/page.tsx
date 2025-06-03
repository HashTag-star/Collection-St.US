'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/core/Logo';

export default function AdminLoginPage() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle admin login logic here
    // On successful login, redirect to /admin/dashboard
    console.log('Admin login form submitted');
    // Example redirect (use Next.js router in a real app):
    // window.location.href = '/admin/dashboard';
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <Link href="/" className="inline-block mb-4">
             <Logo className="h-10 w-auto mx-auto" />
          </Link>
          <CardTitle className="text-2xl font-headline">Admin Portal</CardTitle>
          <CardDescription>Login to manage St.Us Collections.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="admin@stus.com" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full mt-2">Login to Dashboard</Button>
          </form>
        </CardContent>
        <CardFooter>
           <p className="text-xs text-muted-foreground mx-auto">Secure login for authorized personnel only.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
