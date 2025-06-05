
'use server';

import db from './db';
import type { User, NewUserCredentials, LoginCredentials } from './types';

// Helper to map DB row to User type, excluding password
const mapRowToUser = (row: any): User | undefined => {
  if (!row) return undefined;
  const user: User = {
    id: String(row.id), // Convert id to string
    fullName: row.fullName,
    email: row.email,
    password: '', // Password should not be returned
    avatarUrl: row.avatarUrl || undefined,
  };
  return user;
};

// IMPORTANT: This is a mock password check. DO NOT use in production.
const MOCK_COMPARE_PASSWORDS = (submittedPassword: string, storedPasswordHash: string) => {
  // In a real app, 'storedPasswordHash' would be a hash, and you'd use a library like bcrypt to compare.
  // For this prototype, we are storing plaintext passwords (bad practice).
  return submittedPassword === storedPasswordHash;
};

export const signupUser = async (credentials: NewUserCredentials): Promise<{ user?: User; error?: string }> => {
  try {
    // Check if email already exists
    const existingUserStmt = db.prepare('SELECT id FROM users WHERE email = ?');
    const existingUser = existingUserStmt.get(credentials.email);
    if (existingUser) {
      return { error: 'Email already exists.' };
    }

    // In a real app, hash credentials.password before storing
    const stmt = db.prepare(
      'INSERT INTO users (fullName, email, password, avatarUrl) VALUES (@fullName, @email, @password, @avatarUrl)'
    );
    // For admin adding user, avatar can be a default placeholder or null
    const defaultAvatar = `https://placehold.co/100x100.png?text=${credentials.fullName.split(' ').map(n=>n[0]).join('').toUpperCase()}`;
    const info = stmt.run({
      fullName: credentials.fullName,
      email: credentials.email,
      password: credentials.password, // Storing plaintext for prototype simplicity
      avatarUrl: defaultAvatar, // Assign a default avatar
    });

    const newUserId = String(info.lastInsertRowid);
    const newUser = await getUserById(newUserId); // Fetches user without password
    return { user: newUser };

  } catch (error: any) {
    console.error('Signup user failed:', error);
    // SQLite specific error for UNIQUE constraint
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
      return { error: 'Invalid email or password.' };
    }

    // row.password is the stored (plaintext for now) password
    const passwordMatch = MOCK_COMPARE_PASSWORDS(credentials.password, row.password);
    if (!passwordMatch) {
      return { error: 'Invalid email or password.' };
    }

    return { user: mapRowToUser(row) };
  } catch (error) {
    console.error('Login user failed:', error);
    return { error: 'Login failed due to a server error.' };
  }
};

export const getUserById = async (id: string): Promise<User | undefined> => {
  try {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    const row = stmt.get(Number(id)) as any; // Use numeric ID for query
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
    const params: Record<string, any> = { id: Number(userId) }; // Initialize params with id

    if (updates.fullName !== undefined) {
      setClauses.push('fullName = @fullName');
      params.fullName = updates.fullName;
    }
    if (updates.avatarUrl !== undefined) {
      // For this prototype, avatarUrl is a data URI string.
      // In production, this would be a URL to a stored image.
      setClauses.push('avatarUrl = @avatarUrl');
      params.avatarUrl = updates.avatarUrl;
    }

    if (setClauses.length === 0) {
      // No actual data to update, return current user data
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
    // In a real app, you'd hash newPassword here
    const stmt = db.prepare('UPDATE users SET password = ? WHERE id = ?');
    const info = stmt.run(newPassword, Number(userId)); // Store new password (plaintext for proto)

    if (info.changes > 0) {
      return { success: true };
    }
    return { error: 'User not found or password not changed.' };
  } catch (error) {
    console.error(`Failed to update password for user ${userId}:`, error);
    return { error: 'Password update failed.' };
  }
};

// Admin function to delete a user (consider implications carefully)
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

// For Admin Dashboard/Analytics
export const getTotalUserCount = async (): Promise<number> => {
  try {
    const result = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
    return result?.count || 0;
  } catch (error) {
    console.error('Failed to get total user count:', error);
    return 0;
  }
};
