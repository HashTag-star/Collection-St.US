
'use client';

import type { ReactNode, Dispatch, SetStateAction } from 'react';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, signupUser, getUserById } from '@/lib/user-service';
import type { User, LoginCredentials, NewUserCredentials } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  currentUser: User | null;
  isLoadingAuth: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: NewUserCredentials) => Promise<void>;
  logout: () => void;
  setCurrentUser: Dispatch<SetStateAction<User | null>>; // expose setter for profile updates
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Check local storage for persisted user session (client-side only)
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser) as User;
      // Optionally, re-validate with a "getMe" endpoint if you had one
      // For now, just set it if found
      setCurrentUser(parsedUser);
    }
    setIsLoadingAuth(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoadingAuth(true);
    const { user, error } = await loginUser(credentials);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      toast({ title: 'Login Successful', description: `Welcome back, ${user.fullName}!` });
      router.push('/account/profile');
    } else {
      toast({ title: 'Login Failed', description: error || 'An unknown error occurred.', variant: 'destructive' });
    }
    setIsLoadingAuth(false);
  };

  const signup = async (credentials: NewUserCredentials) => {
    setIsLoadingAuth(true);
    const { user, error } = await signupUser(credentials);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      toast({ title: 'Signup Successful', description: `Welcome, ${user.fullName}!` });
      router.push('/account/profile');
    } else {
      toast({ title: 'Signup Failed', description: error || 'An unknown error occurred.', variant: 'destructive' });
    }
    setIsLoadingAuth(false);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ currentUser, isLoadingAuth, login, signup, logout, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
