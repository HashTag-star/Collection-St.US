
'use server';

import db from './db';
import type { NewsletterSubscription } from './types';
import { revalidatePath } from 'next/cache';

export const subscribeToNewsletter = async (
  email: string
): Promise<{ success: boolean; message: string }> => {
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return { success: false, message: 'Please enter a valid email address.' };
  }

  try {
    const existingSubscription = db.prepare('SELECT id FROM newsletter_subscriptions WHERE email = ?').get(email);

    if (existingSubscription) {
      return { success: false, message: 'This email is already subscribed.' };
    }

    const subscribedAt = new Date().toISOString();
    const stmt = db.prepare(
      'INSERT INTO newsletter_subscriptions (email, subscribedAt) VALUES (@email, @subscribedAt)'
    );
    stmt.run({ email, subscribedAt });

    revalidatePath('/admin/dashboard'); // To update subscriber count on dashboard

    return { success: true, message: 'Successfully subscribed to the newsletter!' };
  } catch (error: any) {
    console.error('Failed to subscribe to newsletter:', error);
    // SQLite specific error for UNIQUE constraint might be caught here if somehow the check above fails (race condition unlikely in this setup)
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return { success: false, message: 'This email is already subscribed.' };
    }
    return { success: false, message: 'Subscription failed. Please try again later.' };
  }
};

export const getNewsletterSubscriptionCount = async (): Promise<number> => {
  try {
    const result = db.prepare('SELECT COUNT(*) as count FROM newsletter_subscriptions').get() as { count: number };
    return result?.count || 0;
  } catch (error) {
    console.error('Failed to get newsletter subscription count:', error);
    return 0;
  }
};

export const getAllNewsletterSubscriptions = async (): Promise<NewsletterSubscription[]> => {
  try {
    const rows = db.prepare('SELECT id, email, subscribedAt FROM newsletter_subscriptions ORDER BY subscribedAt DESC').all() as any[];
    return rows.map(row => ({
      id: String(row.id),
      email: row.email,
      subscribedAt: row.subscribedAt,
    }));
  } catch (error) {
    console.error('Failed to get all newsletter subscriptions:', error);
    return [];
  }
};
