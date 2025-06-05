
'use server';

import db from './db';
import type { User, NewUserCredentials, LoginCredentials } from './types';
import { revalidatePath } from 'next/cache';

// Helper to map DB row to User type, excluding password
const mapRowToUser = (row: any): User | undefined => {
  if (!row) return undefined;
  const user: User = {
    id: String(row.id), // Convert id to string
    fullName: row.fullName,
    email: row.email,
    password: '', // Password should not be returned
    avatarUrl: row.avatarUrl || undefined,
    isAdmin: Boolean(row.isAdmin), // Convert integer to boolean
  };
  return user;
};

const MOCK_COMPARE_PASSWORDS = (submittedPassword: string, storedPasswordHash: string) => {
  return submittedPassword === storedPasswordHash;
};

export const signupUser = async (credentials: NewUserCredentials): Promise<{ user?: User; error?: string }> => {
  try {
    const existingUserStmt = db.prepare('SELECT id FROM users WHERE email = ?');
    const existingUser = existingUserStmt.get(credentials.email);
    if (existingUser) {
      return { error: 'Email already exists.' };
    }

    const stmt = db.prepare(
      'INSERT INTO users (fullName, email, password, avatarUrl, isAdmin) VALUES (@fullName, @email, @password, @avatarUrl, @isAdmin)'
    );
    const defaultAvatar = `https://placehold.co/100x100.png?text=${credentials.fullName.split(' ').map(n=>n[0]).join('').toUpperCase()}`;
    const info = stmt.run({
      fullName: credentials.fullName,
      email: credentials.email,
      password: credentials.password, 
      avatarUrl: defaultAvatar, 
      isAdmin: 0, // New users are not admins by default
    });

    const newUserId = String(info.lastInsertRowid);
    const newUser = await getUserById(newUserId); 
    return { user: newUser };

  } catch (error: any) {
    console.error('Signup user failed:', error);
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return { error: 'Email already exists.' };
    }
    return { error: 'Failed to create user account.' };
  }
};

export const loginUser = async (credentials: LoginCredentials): Promise<{ user?: User; error?: string }> => {
  try {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    const row = stmt.get(credentials.email) as any;

    if (!row) {
      console.log(`[AUTH DEBUG] Login attempt: User not found for email ${credentials.email}`);
      return { error: 'Invalid email or password.' };
    }

    const passwordMatch = MOCK_COMPARE_PASSWORDS(credentials.password, row.password);
    if (!passwordMatch) {
      console.log(`[AUTH DEBUG] Login attempt: Password mismatch for email ${credentials.email}. Submitted: '${credentials.password}', Stored in DB: '${row.password}'`);
      return { error: 'Invalid email or password.' };
    }
    console.log(`[AUTH DEBUG] Login successful for email ${credentials.email}. Admin status: ${row.isAdmin}`);
    return { user: mapRowToUser(row) };
  } catch (error) {
    console.error('[AUTH DEBUG] Login user failed with exception:', error);
    return { error: 'Login failed due to a server error.' };
  }
};

export const getUserById = async (id: string): Promise<User | undefined> => {
  try {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    const row = stmt.get(Number(id)) as any; 
    return mapRowToUser(row);
  } catch (error) {
    console.error(`Failed to get user by id ${id}:`, error);
    return undefined;
  }
};

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const stmt = db.prepare('SELECT * FROM users ORDER BY fullName ASC');
    const rows = stmt.all() as any[];
    return rows.map(row => mapRowToUser(row)).filter(user => user !== undefined) as User[];
  } catch (error) {
    console.error('Failed to get all users:', error);
    return [];
  }
};


export const updateUserProfile = async (userId: string, updates: Partial<Pick<User, 'fullName' | 'avatarUrl'>>): Promise<{ user?: User; error?: string }> => {
  try {
    const setClauses: string[] = [];
    const params: Record<string, any> = { id: Number(userId) }; 

    if (updates.fullName !== undefined) {
      setClauses.push('fullName = @fullName');
      params.fullName = updates.fullName;
    }
    if (updates.avatarUrl !== undefined) {
      setClauses.push('avatarUrl = @avatarUrl');
      params.avatarUrl = updates.avatarUrl;
    }

    if (setClauses.length === 0) {
      const currentUserData = await getUserById(userId);
      return { user: currentUserData };
    }

    const sql = `UPDATE users SET ${setClauses.join(', ')} WHERE id = @id`;
    const stmt = db.prepare(sql);
    const info = stmt.run(params);

    if (info.changes > 0) {
      const updatedUser = await getUserById(userId);
      return { user: updatedUser };
    }
    return { error: 'User not found or no changes made.' };

  } catch (error) {
    console.error(`Failed to update profile for user ${userId}:`, error);
    return { error: 'Profile update failed.' };
  }
};

export const updateUserPassword = async (userId: string, newPassword: string): Promise<{ success?: boolean; error?: string }> => {
  try {
    const stmt = db.prepare('UPDATE users SET password = ? WHERE id = ?');
    const info = stmt.run(newPassword, Number(userId)); 

    if (info.changes > 0) {
      return { success: true };
    }
    return { error: 'User not found or password not changed.' };
  } catch (error) {
    console.error(`Failed to update password for user ${userId}:`, error);
    return { error: 'Password update failed.' };
  }
};

export const deleteUserById = async (id: string): Promise<{ success?: boolean; error?: string }> => {
  try {
    const stmt = db.prepare('DELETE FROM users WHERE id = ?');
    const info = stmt.run(Number(id));
    if (info.changes > 0) {
      return { success: true };
    }
    return { error: 'User not found or no deletion occurred.' };
  } catch (error) {
    console.error(`Failed to delete user ${id}:`, error);
    return { error: 'User deletion failed.' };
  }
};

export const getTotalUserCount = async (): Promise<number> => {
  try {
    const result = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
    return result?.count || 0;
  } catch (error) {
    console.error('Failed to get total user count:', error);
    return 0;
  }
};

export const updateUserAdminStatus = async (userId: string, isAdmin: boolean): Promise<{ success?: boolean; error?: string }> => {
  try {
    const stmt = db.prepare('UPDATE users SET isAdmin = ? WHERE id = ?');
    const info = stmt.run(isAdmin ? 1 : 0, Number(userId));

    if (info.changes > 0) {
      revalidatePath('/admin/user-management');
      return { success: true };
    }
    return { error: 'User not found or admin status not changed.' };
  } catch (error) {
    console.error(`Failed to update admin status for user ${userId}:`, error);
    return { error: 'Failed to update admin status.' };
  }
};
