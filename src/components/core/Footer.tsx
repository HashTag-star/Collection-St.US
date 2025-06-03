import { Logo } from '@/components/core/Logo';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t mt-auto">
      <div className="container py-8 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <Logo className="h-8 w-auto mr-2" />
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} St.Us Collections. All rights reserved.
          </p>
        </div>
        <nav className="flex space-x-4">
          <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Terms of Service
          </Link>
        </nav>
      </div>
    </footer>
  );
}
