
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/core/Logo';
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from 'lucide-react';

const ADMIN_EMAIL = 'admin@stus.com';

export default function AdminLoginPage() {
  const { login, logout, isLoadingAuth, currentUser } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // Use the login function from AuthContext
    // It will set currentUser if successful
    await login({ email, password });

    // After login attempt, currentUser in AuthContext should be updated.
    // We need a slight delay or a way to react to currentUser change.
    // For now, let's check it directly, but this might have timing issues
    // if `login` is fully async and doesn't update `currentUser` before this check.
    // A more robust way would be to have `login` return the user or rely on useEffect.
    
    // The AuthContext's login function already handles toast for general login success/failure.
    // We need to check if the logged-in user is the admin *after* AuthContext updates.
  };

  React.useEffect(() => {
    if (!isLoadingAuth && currentUser) {
      if (currentUser.email === ADMIN_EMAIL) {
        toast({ title: 'Admin Login Successful', description: `Welcome, ${currentUser.fullName}!` });
        router.push('/admin/dashboard');
      } else {
        // Logged in as a regular user, not admin
        toast({ 
          title: 'Authorization Failed', 
          description: 'You are not authorized to access the admin panel.', 
          variant: 'destructive' 
        });
        logout(); // Log out the non-admin user
      }
    }
  }, [currentUser, isLoadingAuth, router, toast, logout]);


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
              <Input 
                id="email" 
                type="email" 
                placeholder="admin@stus.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoadingAuth}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoadingAuth}
              />
            </div>
            <Button type="submit" className="w-full mt-2" disabled={isLoadingAuth}>
              {isLoadingAuth ? <Loader2 className="animate-spin" /> : 'Login to Dashboard'}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
           <p className="text-xs text-muted-foreground mx-auto">Use admin credentials to access the dashboard.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
    