
'use server';

import db from './db';
import { revalidatePath } from 'next/cache';

export type AllSettings = Record<string, string | boolean>;

const parseValue = (key: string, value: string | null | undefined): string | boolean | undefined => {
  if (value === null || value === undefined) return undefined;

  // Define keys that should be treated as booleans
  const booleanKeys = [
    'enableCardPayments', 
    'localPickup', 
    'adminNewOrder', 
    'adminLowStock', 
    'customerOrderConfirmation', 
    'customerShippingUpdate', 
    'customerOrderDelivered'
  ];

  if (booleanKeys.includes(key)) {
    return value === 'true';
  }
  return value;
};

export const getSetting = async (key: string): Promise<string | boolean | undefined> => {
  try {
    const stmt = db.prepare('SELECT value FROM store_settings WHERE key = ?');
    const row = stmt.get(key) as { value: string } | undefined;
    return row ? parseValue(key, row.value) : undefined;
  } catch (error) {
    console.error(`Failed to get setting ${key}:`, error);
    return undefined;
  }
};

export const getAllSettings = async (): Promise<AllSettings> => {
  try {
    const stmt = db.prepare('SELECT key, value FROM store_settings');
    const rows = stmt.all() as { key: string; value: string }[];
    const settings: AllSettings = {};
    for (const row of rows) {
      const parsed = parseValue(row.key, row.value);
      if (parsed !== undefined) {
        settings[row.key] = parsed;
      }
    }
    return settings;
  } catch (error) {
    console.error('Failed to get all settings:', error);
    return {};
  }
};

export const updateSetting = async (key: string, value: string | boolean): Promise<void> => {
  try {
    const stmt = db.prepare('INSERT OR REPLACE INTO store_settings (key, value) VALUES (@key, @value)');
    stmt.run({ key, value: String(value) }); // Store boolean as 'true' or 'false' string
    revalidatePath('/admin/settings');
  } catch (error) {
    console.error(`Failed to update setting ${key}:`, error);
    throw error; // Re-throw to be caught by the caller for toast notifications
  }
};

export const updateMultipleSettings = async (settingsToUpdate: Record<string, string | boolean>): Promise<void> => {
    const stmt = db.prepare('INSERT OR REPLACE INTO store_settings (key, value) VALUES (@key, @value)');
    try {
        db.transaction(() => {
            for (const [key, value] of Object.entries(settingsToUpdate)) {
                stmt.run({ key, value: String(value) });
            }
        })();
        revalidatePath('/admin/settings');
    } catch (error) {
        console.error('Failed to update multiple settings:', error);
        throw error;
    }
};
