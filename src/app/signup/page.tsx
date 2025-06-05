
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/core/Logo';
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';

export default function SignupPage() {
  const { signup, isLoadingAuth } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [passwordStrengthErrors, setPasswordStrengthErrors] = useState<string[]>([]);

  const validatePassword = (pass: string): string[] => {
    const errors: string[] = [];
    if (pass.length < 8) {
      errors.push('Password must be at least 8 characters long.');
    }
    if (!/[A-Z]/.test(pass)) {
      errors.push('Password must contain at least one uppercase letter.');
    }
    if (!/[a-z]/.test(pass)) {
      errors.push('Password must contain at least one lowercase letter.');
    }
    if (!/\d/.test(pass)) {
      errors.push('Password must contain at least one number.');
    }
    // Optional: Add symbol requirement if needed
    // if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(pass)) {
    //   errors.push('Password must contain at least one special character.');
    // }
    return errors;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    const strengthErrors = validatePassword(newPassword);
    setPasswordStrengthErrors(strengthErrors);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError('');
    setPasswordStrengthErrors([]);

    const strengthErrors = validatePassword(password);
    if (strengthErrors.length > 0) {
      setPasswordStrengthErrors(strengthErrors);
      setFormError('Please address the password requirements.');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }
    await signup({ fullName, email, password });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <Link href="/" className="inline-block mb-4">
            <Logo className="h-10 w-auto mx-auto" />
          </Link>
          <CardTitle className="text-2xl font-headline">Create an Account</CardTitle>
          <CardDescription>Join St.Us Collections today!</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Festus Us"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isLoadingAuth}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
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
                onChange={handlePasswordChange}
                disabled={isLoadingAuth}
                aria-describedby="password-strength-errors"
              />
              {passwordStrengthErrors.length > 0 && (
                <div id="password-strength-errors" className="text-xs text-destructive mt-1 space-y-0.5">
                  {passwordStrengthErrors.map((err, index) => (
                    <p key={index} role="alert">{err}</p>
                  ))}
                </div>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoadingAuth}
              />
            </div>
            {formError && (
              <Alert variant="destructive">
                <ShieldAlert className="h-4 w-4" />
                <AlertTitle>Signup Error</AlertTitle>
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full mt-2" disabled={isLoadingAuth || passwordStrengthErrors.length > 0}>
              {isLoadingAuth ? <Loader2 className="animate-spin" /> : 'Sign Up'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
