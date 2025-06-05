
'use client';

import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Users as UsersIconLucide, ShieldAlert } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getAllUsers, updateUserAdminStatus } from '@/lib/user-service';
import type { User } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AdminUserManagementPage() {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({});

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [userToToggle, setUserToToggle] = useState<User | null>(null);
  const [newAdminState, setNewAdminState] = useState(false);


  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const fetchedUsers = await getAllUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        toast({ title: "Error", description: "Could not load users.", variant: "destructive" });
      }
      setIsLoading(false);
    };
    fetchUsers();
  }, [toast]);
  
  const getInitials = (name: string = "") => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  }

  const handleAdminStatusChangeAttempt = (user: User, newStatus: boolean) => {
    if (user.id === currentUser?.id) {
      toast({ title: "Action Not Allowed", description: "You cannot change your own admin status.", variant: "destructive" });
      return;
    }
    setUserToToggle(user);
    setNewAdminState(newStatus);
    setShowConfirmDialog(true);
  };
  
  const confirmAdminStatusChange = async () => {
    if (!userToToggle) return;

    setIsUpdating(prev => ({ ...prev, [userToToggle.id]: true }));
    setShowConfirmDialog(false);

    const { success, error } = await updateUserAdminStatus(userToToggle.id, newAdminState);

    setIsUpdating(prev => ({ ...prev, [userToToggle.id]: false }));

    if (success) {
      toast({ title: "Admin Status Updated", description: `${userToToggle.fullName}'s admin status has been ${newAdminState ? 'granted' : 'revoked'}.` });
      setUsers(prevUsers => 
        prevUsers.map(u => u.id === userToToggle.id ? { ...u, isAdmin: newAdminState } : u)
      );
    } else {
      toast({ title: "Error", description: error || "Could not update admin status.", variant: "destructive" });
    }
    setUserToToggle(null);
  };


  if (isLoading) {
     return (
      <div className="space-y-6">
        <h1 className="font-headline text-3xl font-semibold">User Management</h1>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">User List</CardTitle>
            <CardDescription>Manage user roles and permissions.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-2">Loading users...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-semibold">User Management</h1>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">User List</CardTitle>
          <CardDescription>View and manage user roles. Toggle admin status for users.</CardDescription>
        </CardHeader>
        <CardContent>
          {users.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden sm:table-cell">Avatar</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-center">Is Admin?</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="hidden sm:table-cell">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user.avatarUrl || `https://placehold.co/40x40.png?text=${getInitials(user.fullName)}`} alt={user.fullName} data-ai-hint="user avatar" />
                        <AvatarFallback>{getInitials(user.fullName)}</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">{user.fullName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="text-center">
                      {isUpdating[user.id] ? (
                        <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                      ) : (
                        <Switch
                          checked={!!user.isAdmin}
                          onCheckedChange={(checked) => handleAdminStatusChangeAttempt(user, checked)}
                          disabled={user.id === currentUser?.id || isUpdating[user.id]}
                          aria-label={`Toggle admin status for ${user.fullName}`}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <UsersIconLucide className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="font-headline text-2xl font-semibold mb-2">No Users Found</h2>
              <p className="text-muted-foreground">User list will appear here once they sign up.</p>
            </div>
          )}
        </CardContent>
      </Card>
       <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Admin Status Change</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {newAdminState ? 'grant' : 'revoke'} admin privileges 
              for {userToToggle?.fullName}?
            </AlertDialogDescription>
            {userToToggle?.email === 'admin@stus.com' && !newAdminState && (
                <div className="mt-2 p-3 bg-destructive/10 border border-destructive/50 rounded-md text-sm text-destructive flex items-start">
                    <ShieldAlert className="h-5 w-5 mr-2 mt-0.5 shrink-0"/>
                    <span>Warning: Revoking admin status for the primary seeded admin (admin@stus.com) might affect initial system access if no other admins are present.</span>
                </div>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUserToToggle(null)} disabled={isUpdating[userToToggle?.id || '']}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmAdminStatusChange} disabled={isUpdating[userToToggle?.id || '']} 
              className={newAdminState ? "" : "bg-destructive hover:bg-destructive/90 text-destructive-foreground"}
            >
              {isUpdating[userToToggle?.id || ''] ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {newAdminState ? 'Grant Admin' : 'Revoke Admin'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
