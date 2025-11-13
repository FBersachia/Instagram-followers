import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface WhitelistRow extends RowDataPacket {
  username: string;
  created_at: Date;
}

export async function addToWhitelist(username: string): Promise<void> {
  if (!username || username.trim() === '') {
    throw new Error('Username cannot be empty');
  }

  try {
    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO whitelist (username) VALUES (?)',
      [username.trim()]
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

export async function removeFromWhitelist(username: string): Promise<void> {
  if (!username || username.trim() === '') {
    throw new Error('Username cannot be empty');
  }

  const [result] = await pool.execute<ResultSetHeader>(
    'DELETE FROM whitelist WHERE username = ?',
    [username.trim()]
  );

  if (result.affectedRows === 0) {
    throw new Error('Username not found in whitelist');
  }
}

export async function getWhitelist(): Promise<string[]> {
  const [rows] = await pool.execute<WhitelistRow[]>(
    'SELECT username FROM whitelist ORDER BY created_at DESC'
  );

  return rows.map((row) => row.username);
}

export async function isInWhitelist(username: string): Promise<boolean> {
  if (!username || username.trim() === '') {
    throw new Error('Username cannot be empty');
  }

  const [rows] = await pool.execute<WhitelistRow[]>(
    'SELECT username FROM whitelist WHERE username = ?',
    [username.trim()]
  );

  return rows.length > 0;
}