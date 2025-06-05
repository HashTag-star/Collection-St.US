
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import {
  Bell,
  Home,
  Package,
  ShoppingCart,
  Users,
  LineChart,
  Settings,
  LogOut,
  Palette,
  Menu,
  User, 
  MailOpen, 
  Loader2,
  ShieldCheck, // Icon for User Management
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Logo } from '@/components/core/Logo';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: Home },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart, badge: 0 },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/products/new', label: 'Add Product (AI)', icon: Palette },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/user-management', label: 'User Management', icon: ShieldCheck }, // New item
  { href: '/admin/subscribers', label: 'Subscribers', icon: MailOpen },
  { href: '/admin/analytics', label: 'Analytics', icon: LineChart },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, isLoadingAuth, logout } = useAuth();

  useEffect(() => {
    if (!isLoadingAuth) {
      // Check if user is not admin or not logged in, and not on the login page
      if ((!currentUser || !currentUser.isAdmin) && pathname !== '/admin/login') {
        router.push('/admin/login');
      }
      // If user is admin and on the login page, redirect to dashboard
      if (currentUser && currentUser.isAdmin && pathname === '/admin/login') {
        router.push('/admin/dashboard');
      }
    }
  }, [currentUser, isLoadingAuth, router, pathname]);

  if (isLoadingAuth && pathname !== '/admin/login') {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  if (pathname === '/admin/login') {
      // For the login page itself, just render children without the full admin layout
      // if user is not yet authenticated as admin. The effect above handles redirection if already admin.
      return <>{children}</>;
  }

  // If after loading, still no admin user and not on login page, implies redirection is happening or should have.
  // This check prevents rendering the layout for non-admin/non-logged-in users on protected pages.
  if (!currentUser || !currentUser.isAdmin) {
    return null; 
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-sidebar md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold">
              <Logo className="h-8 w-auto text-sidebar-primary" />
              <span className="font-headline text-sidebar-foreground">Admin</span>
            </Link>
            <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-sidebar-primary hover:bg-sidebar-accent
                    ${pathname === item.href ? 'bg-sidebar-accent text-sidebar-primary' : 'text-sidebar-foreground'}`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                  {item.badge && item.badge > 0 && ( 
                    <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              ))}
            </nav>
          </div>
          <div className="mt-auto p-4">
            <Card>
              <CardHeader className="p-2 pt-0 md:p-4">
                <CardTitle>Need Help?</CardTitle>
                <CardDescription>
                  Contact support or visit our documentation.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                <Button size="sm" className="w-full" disabled>
                  Get Support
                </Button>
              </CardContent>
            </Card>
            <Button 
              variant="ghost" 
              className="mt-4 w-full justify-start gap-3 rounded-lg px-3 py-2 text-sidebar-muted-foreground transition-all hover:text-sidebar-primary"
              onClick={() => {
                logout(); 
                router.push('/'); 
              }}
            >
                <LogOut className="h-4 w-4" />
                Logout / View Store
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="/admin/dashboard"
                  className="flex items-center gap-2 text-lg font-semibold mb-4"
                >
                  <Logo className="h-8 w-auto" />
                  <span className="sr-only">St.Us Admin</span>
                </Link>
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground
                      ${pathname === item.href ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                    {item.badge && item.badge > 0 && (
                      <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto">
                <Card>
                  <CardHeader>
                    <CardTitle>Need Help?</CardTitle>
                    <CardDescription>
                       Contact support or visit our documentation.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button size="sm" className="w-full" disabled>
                      Get Support
                    </Button>
                  </CardContent>
                </Card>
                 <Button 
                    variant="ghost" 
                    className="mt-4 w-full justify-start gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                    onClick={() => {
                        logout();
                        router.push('/');
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout / View Store
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{currentUser?.fullName || 'Admin'}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>Settings</DropdownMenuItem>
              <DropdownMenuItem disabled>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => {
                  logout();
                  router.push('/admin/login'); 
              }}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-muted/20">
          {children}
        </main>
      </div>
    </div>
  );
}
