
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
import { Loader2, Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage() {
  const { login, logout, isLoadingAuth, currentUser } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // The login function in AuthContext now handles setting currentUser
    // The useEffect below will handle redirection based on isAdmin status
    await login({ email, password });
  };

  React.useEffect(() => {
    if (!isLoadingAuth && currentUser) {
      if (currentUser.isAdmin) { // Check isAdmin flag
        toast({ title: 'Admin Login Successful', description: `Welcome, ${currentUser.fullName}!` });
        router.push('/admin/dashboard');
      } else {
        toast({ 
          title: 'Authorization Failed', 
          description: 'You are not authorized to access the admin panel.', 
          variant: 'destructive' 
        });
        logout();
      }
    }
    // If login fails (currentUser remains null and isLoadingAuth becomes false), 
    // AuthContext's login function will have already shown a toast.
  }, [currentUser, isLoadingAuth, router, toast, logout]);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

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
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoadingAuth}
                  className="pr-10"
                />
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={isLoadingAuth}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
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
