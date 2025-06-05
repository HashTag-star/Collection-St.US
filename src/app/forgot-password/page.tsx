
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/core/Logo';
import { AlertCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <Link href="/" className="inline-block mb-4">
            <Logo className="h-10 w-auto mx-auto" />
          </Link>
          <CardTitle className="text-2xl font-headline">Forgot Password</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <AlertCircle className="mx-auto h-12 w-12 text-primary" />
          <CardDescription>
            The full "Forgot Password" functionality, which typically involves email verification, 
            is currently under development and not implemented in this prototype.
          </CardDescription>
          <p className="text-sm text-muted-foreground">
            Thank you for your understanding.
          </p>
          <Button asChild className="w-full">
            <Link href="/login">Back to Login</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
