
'use server';

import type { User, NewUserCredentials, LoginCredentials } from './types';

let users: User[] = [
    { id: '1', fullName: 'Festus Us', email: 'festus@example.com', password: 'password123', avatarUrl: 'https://placehold.co/100x100.png' },
]; // Mock initial user for testing profile page

let nextUserId = users.length > 0 ? Math.max(...users.map(u => parseInt(u.id))) + 1 : 1;

// IMPORTANT: This is a mock password check. DO NOT use in production.
const MOCK_COMPARE_PASSWORDS = (submittedPassword: string, storedPassword: string) => {
  return submittedPassword === storedPassword;
};

export const signupUser = async (credentials: NewUserCredentials): Promise<{ user?: User; error?: string }> => {
  if (users.find(user => user.email === credentials.email)) {
    return { error: 'Email already exists.' };
  }
  const newUser: User = {
    id: (nextUserId++).toString(),
    fullName: credentials.fullName,
    email: credentials.email,
    password: credentials.password, // In real app, hash this password
  };
  users.push(newUser);
  const userToReturn = { ...newUser };
  // @ts-ignore
  delete userToReturn.password; // Don't send password back
  return { user: userToReturn };
};

export const loginUser = async (credentials: LoginCredentials): Promise<{ user?: User; error?: string }> => {
  const user = users.find(u => u.email === credentials.email);
  if (!user) {
    return { error: 'Invalid email or password.' };
  }

  const passwordMatch = MOCK_COMPARE_PASSWORDS(credentials.password, user.password);
  if (!passwordMatch) {
    return { error: 'Invalid email or password.' };
  }
  const userToReturn = { ...user };
  // @ts-ignore
  delete userToReturn.password; // Don't send password back
  return { user: userToReturn };
};

export const getUserById = async (id: string): Promise<User | undefined> => {
  const user = users.find(u => u.id === id);
  if (user) {
    const userToReturn = { ...user };
    // @ts-ignore
    delete userToReturn.password;
    return userToReturn;
  }
  return undefined;
};

// Function to update user profile (basic example)
export const updateUserProfile = async (userId: string, updates: Partial<Pick<User, 'fullName' | 'avatarUrl'>>): Promise<{ user?: User; error?: string }> => {
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex === -1) {
    return { error: 'User not found.' };
  }
  users[userIndex] = { ...users[userIndex], ...updates };
  const updatedUser = { ...users[userIndex] };
  // @ts-ignore
  delete updatedUser.password;
  return { user: updatedUser };
};

// Function to update user password (basic example)
export const updateUserPassword = async (userId: string, newPassword: string): Promise<{ success?: boolean; error?: string }> => {
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
        return { error: 'User not found.' };
    }
    // In a real app, you'd check the current password first
    users[userIndex].password = newPassword; // Store new password (in real app, hash it)
    return { success: true };
};
