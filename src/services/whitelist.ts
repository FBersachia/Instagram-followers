import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface WhitelistRow extends RowDataPacket {
  username: string;
  created_at: Date;
}

export async function addToWhitelist(userId: number, username: string): Promise<void> {
  if (!userId || userId <= 0) {
    throw new Error('Valid userId is required');
  }
  if (!username || username.trim() === '') {
    throw new Error('Username cannot be empty');
  }

  try {
    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO whitelist (user_id, username) VALUES (?, ?)',
      [userId, username.trim()]
    );

    if (result.affectedRows === 0) {
      throw new Error('Failed to add username to whitelist');
    }
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw new Error('Username already exists in whitelist');
    }
    throw error;
  }
}

export async function removeFromWhitelist(userId: number, username: string): Promise<void> {
  if (!userId || userId <= 0) {
    throw new Error('Valid userId is required');
  }
  if (!username || username.trim() === '') {
    throw new Error('Username cannot be empty');
  }

  const [result] = await pool.execute<ResultSetHeader>(
    'DELETE FROM whitelist WHERE user_id = ? AND username = ?',
    [userId, username.trim()]
  );

  if (result.affectedRows === 0) {
    throw new Error('Username not found in whitelist');
  }
}

export async function getWhitelist(userId: number): Promise<string[]> {
  if (!userId || userId <= 0) {
    throw new Error('Valid userId is required');
  }
  const [rows] = await pool.execute<WhitelistRow[]>(
    'SELECT username FROM whitelist WHERE user_id = ? ORDER BY created_at DESC',
    [userId]
  );

  return rows.map((row) => row.username);
}

export async function isInWhitelist(userId: number, username: string): Promise<boolean> {
  if (!userId || userId <= 0) {
    throw new Error('Valid userId is required');
  }
  if (!username || username.trim() === '') {
    throw new Error('Username cannot be empty');
  }

  const [rows] = await pool.execute<WhitelistRow[]>(
    'SELECT username FROM whitelist WHERE user_id = ? AND username = ?',
    [userId, username.trim()]
  );

  return rows.length > 0;
}
