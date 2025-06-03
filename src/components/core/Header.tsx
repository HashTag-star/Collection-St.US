import Link from 'next/link';
import { ShoppingCart, User, Search, Menu } from 'lucide-react';
import { Logo } from '@/components/core/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function Header() {
  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    // { href: '/categories', label: 'Categories' }, // Example for later
    // { href: '/about', label: 'About Us' }, // Example for later
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo className="h-8 w-auto" />
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-3/4 sm:w-1/2">
              <Link href="/" className="mb-6 flex items-center">
                <Logo className="h-8 w-auto" />
              </Link>
              <nav className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-lg font-medium transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                ))}
                 <Link href="/admin/login" className="text-lg font-medium transition-colors hover:text-primary">Admin Login</Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
        
        {/* Mobile Logo (centered when menu is shown) */}
        <div className="flex flex-1 items-center justify-center md:hidden">
          <Link href="/" className="flex items-center">
            <Logo className="h-8 w-auto" />
          </Link>
        </div>


        <div className="flex flex-1 items-center justify-end space-x-2">
          <form className="hidden md:block ml-auto w-full max-w-xs">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search products..." className="pl-9" />
            </div>
          </form>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Shopping Cart</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/login">
              <User className="h-5 w-5" />
              <span className="sr-only">Login / My Account</span>
            </Link>
          </Button>
          <div className="hidden md:block">
             <Button variant="outline" size="sm" asChild>
                <Link href="/admin/login">Admin</Link>
             </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
