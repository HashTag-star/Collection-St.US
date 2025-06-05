
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import React, { useState, useEffect } from 'react';
import { updateUserProfile, updateUserPassword } from '@/lib/user-service';
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const { currentUser, setCurrentUser, isLoadingAuth } = useAuth();
  const { toast } = useToast();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);


  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.fullName);
      setEmail(currentUser.email);
      setAvatarUrl(currentUser.avatarUrl || 'https://placehold.co/100x100.png');
    }
  }, [currentUser]);

  const getInitials = (name: string = "") => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  }

  const handleProfileUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentUser) return;
    setIsUpdatingProfile(true);

    const { user: updatedUser, error } = await updateUserProfile(currentUser.id, { fullName });
    if (updatedUser) {
      setCurrentUser(updatedUser); // Update context
      localStorage.setItem('currentUser', JSON.stringify(updatedUser)); // Update local storage
      toast({ title: "Profile Updated", description: "Your personal information has been saved." });
    } else {
      toast({ title: "Update Failed", description: error || "Could not update profile.", variant: "destructive" });
    }
    setIsUpdatingProfile(false);
  };

  const handlePasswordUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentUser) return;
    if (newPassword !== confirmNewPassword) {
      toast({ title: "Password Mismatch", description: "New passwords do not match.", variant: "destructive" });
      return;
    }
    if (!newPassword) {
      toast({ title: "Password Required", description: "New password cannot be empty.", variant: "destructive" });
      return;
    }
    setIsUpdatingPassword(true);
    const { success, error } = await updateUserPassword(currentUser.id, newPassword);
    if (success) {
        toast({ title: "Password Updated", description: "Your password has been changed successfully." });
        setNewPassword('');
        setConfirmNewPassword('');
    } else {
        toast({ title: "Update Failed", description: error || "Could not update password.", variant: "destructive" });
    }
    setIsUpdatingPassword(false);
  };

  if (isLoadingAuth || !currentUser) {
    return <div className="text-center py-10"><Loader2 className="mx-auto h-8 w-8 animate-spin" /> <p>Loading profile...</p></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-semibold">My Profile</h1>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Personal Information</CardTitle>
          <CardDescription>Update your personal details and email address.</CardDescription>
        </CardHeader>
        <form onSubmit={handleProfileUpdate}>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={avatarUrl} alt={currentUser.fullName} data-ai-hint="profile avatar" />
                <AvatarFallback>{getInitials(currentUser.fullName)}</AvatarFallback>
              </Avatar>
              <Button type="button" variant="outline" disabled>Change Avatar (Soon)</Button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={isUpdatingProfile} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" value={email} disabled />
                 <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="ml-auto" disabled={isUpdatingProfile || fullName === currentUser.fullName}>
              {isUpdatingProfile ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Save Changes'}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Change Password</CardTitle>
          <CardDescription>Update your account password.</CardDescription>
        </CardHeader>
        <form onSubmit={handlePasswordUpdate}>
            <CardContent className="space-y-4">
                <div className="grid gap-1.5">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} disabled={isUpdatingPassword} required />
                </div>
                <div className="grid gap-1.5">
                    <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                    <Input id="confirmNewPassword" type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} disabled={isUpdatingPassword} required />
                </div>
            </CardContent>
            <CardFooter>
                <Button type="submit" className="ml-auto" disabled={isUpdatingPassword || !newPassword || !confirmNewPassword}>
                    {isUpdatingPassword ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Update Password'}
                </Button>
            </CardFooter>
        </form>
      </Card>
    </div>
  );
}
