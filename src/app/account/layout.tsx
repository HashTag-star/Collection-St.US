
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { User, ShoppingBag, Heart, MapPin, LogOut, Settings } from 'lucide-react';
import { Header } from '@/components/core/Header';
import { Footer } from '@/components/core/Footer';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import React, { useEffect } from 'react';

const accountNavItems = [
  { href: '/account/profile', label: 'My Profile', icon: User },
  { href: '/account/orders', label: 'My Orders', icon: ShoppingBag },
  { href: '/account/addresses', label: 'My Addresses', icon: MapPin },
  { href: '/account/wishlist', label: 'Wishlist', icon: Heart },
  { href: '/account/settings', label: 'Account Settings', icon: Settings },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { currentUser, isLoadingAuth, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoadingAuth && !currentUser) {
      router.push('/login?redirect=/account/profile');
    }
  }, [currentUser, isLoadingAuth, router]);

  if (isLoadingAuth || !currentUser) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto py-8 text-center">
          <p>Loading account information...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="container mx-auto flex-grow py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-1/4 lg:w-1/5">
            <h2 className="font-headline text-2xl font-semibold mb-4">My Account</h2>
            <nav className="space-y-1">
              {accountNavItems.map((item) => (
                <Button
                  key={item.label}
                  variant={pathname === item.href ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Link>
                </Button>
              ))}
              <Separator className="my-2" />
              <Button 
                variant="ghost" 
                className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={logout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </nav>
          </aside>
          <main className="flex-1 md:w-3/4 lg:w-4/5">
            {children}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
