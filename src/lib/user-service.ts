
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
      'INSERT INTO users (fullName, email, password) VALUES (@fullName, @email, @password)'
    );
    const info = stmt.run({
      fullName: credentials.fullName,
      email: credentials.email,
      password: credentials.password, // Storing plaintext for prototype simplicity
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

export const updateUserProfile = async (userId: string, updates: Partial<Pick<User, 'fullName' | 'avatarUrl'>>): Promise<{ user?: User; error?: string }> => {
  try {
    const setClauses: string[] = [];
    const params: any = { id: Number(userId) };

    if (updates.fullName !== undefined) {
      setClauses.push('fullName = @fullName');
      params.fullName = updates.fullName;
    }
    if (updates.avatarUrl !== undefined) {
      setClauses.push('avatarUrl = @avatarUrl');
      params.avatarUrl = updates.avatarUrl;
    }

    if (setClauses.length === 0) {
      return { user: await getUserById(userId) }; // No updates
    }

    const sql = `UPDATE users SET ${setClauses.join(', ')} WHERE id = @id`;
    const stmt = db.prepare(sql);
    const info = stmt.run(params);

    if (info.changes > 0) {
      return { user: await getUserById(userId) };
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
