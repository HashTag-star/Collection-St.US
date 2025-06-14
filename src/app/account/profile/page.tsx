
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import React, { useState, useEffect, useRef, type ChangeEvent } from 'react';
import { updateUserProfile, updateUserPassword } from '@/lib/user-service';
import { useToast } from "@/hooks/use-toast";
import { Loader2, Eye, EyeOff } from 'lucide-react';

export default function ProfilePage() {
  const { currentUser, setCurrentUser, isLoadingAuth } = useAuth();
  const { toast } = useToast();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const [selectedAvatarFile, setSelectedAvatarFile] = useState<string | null>(null); // Store as data URI for preview
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.fullName);
      setEmail(currentUser.email);
      setSelectedAvatarFile(null); 
    }
  }, [currentUser]);

  const getInitials = (name: string = "") => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  }

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedAvatarFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentUser) return;
    setIsUpdatingProfile(true);

    const updates: { fullName?: string; avatarUrl?: string } = {};
    let changed = false;

    if (fullName !== currentUser.fullName) {
      updates.fullName = fullName;
      changed = true;
    }
    if (selectedAvatarFile) {
      updates.avatarUrl = selectedAvatarFile;
      changed = true;
    }

    if (!changed) {
      toast({ title: "No Changes", description: "No information was changed." });
      setIsUpdatingProfile(false);
      return;
    }

    const { user: updatedUser, error } = await updateUserProfile(currentUser.id, updates);
    if (updatedUser) {
      setCurrentUser(updatedUser); 
      localStorage.setItem('currentUser', JSON.stringify(updatedUser)); 
      setSelectedAvatarFile(null); 
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
        setShowNewPassword(false);
        setShowConfirmNewPassword(false);
    } else {
        toast({ title: "Update Failed", description: error || "Could not update password.", variant: "destructive" });
    }
    setIsUpdatingPassword(false);
  };

  const toggleShowNewPassword = () => setShowNewPassword(!showNewPassword);
  const toggleShowConfirmNewPassword = () => setShowConfirmNewPassword(!showConfirmNewPassword);

  if (isLoadingAuth || !currentUser) {
    return <div className="text-center py-10"><Loader2 className="mx-auto h-8 w-8 animate-spin" /> <p>Loading profile...</p></div>;
  }

  const currentAvatarSrc = selectedAvatarFile || currentUser.avatarUrl || 'https://placehold.co/100x100.png';
  const canSaveChanges = fullName !== currentUser.fullName || !!selectedAvatarFile;

  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-semibold">My Profile</h1>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Personal Information</CardTitle>
          <CardDescription>Update your personal details and avatar.</CardDescription>
        </CardHeader>
        <form onSubmit={handleProfileUpdate}>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={currentAvatarSrc} alt={currentUser.fullName} data-ai-hint="profile avatar" />
                <AvatarFallback>{getInitials(currentUser.fullName)}</AvatarFallback>
              </Avatar>
              <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                Change Avatar
              </Button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleAvatarChange} 
              />
            </div>
            {selectedAvatarFile && <p className="text-xs text-muted-foreground">New avatar selected. Click &quot;Save Changes&quot; to apply.</p>}
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
            <Button type="submit" className="ml-auto" disabled={isUpdatingProfile || !canSaveChanges}>
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
                    <div className="relative">
                      <Input 
                        id="newPassword" 
                        type={showNewPassword ? "text" : "password"} 
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)} 
                        disabled={isUpdatingPassword} 
                        required 
                        className="pr-10"
                      />
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground"
                        onClick={toggleShowNewPassword}
                        aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                        disabled={isUpdatingPassword}
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                </div>
                <div className="grid gap-1.5">
                    <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                    <div className="relative">
                      <Input 
                        id="confirmNewPassword" 
                        type={showConfirmNewPassword ? "text" : "password"} 
                        value={confirmNewPassword} 
                        onChange={(e) => setConfirmNewPassword(e.target.value)} 
                        disabled={isUpdatingPassword} 
                        required 
                        className="pr-10"
                      />
                       <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground"
                        onClick={toggleShowConfirmNewPassword}
                        aria-label={showConfirmNewPassword ? "Hide confirm new password" : "Show confirm new password"}
                        disabled={isUpdatingPassword}
                      >
                        {showConfirmNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button type="submit" className="ml-auto" disabled={isUpdatingPassword || !newPassword || !confirmNewPassword}>
                    {isUpdatingPassword ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Update Password'}
                </Button>
            </CardFooter>
        </form>
      </Card>
      <p className="text-xs text-muted-foreground text-center">
        Note: For prototype purposes, uploaded avatars are stored as data URIs in the database. In a production app, they would be uploaded to a dedicated file storage service.
      </p>
    </div>
  );
}
