import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { isInWhitelist } from './whitelist';

interface NonFollowerRow extends RowDataPacket {
  username: string;
  created_at: Date;
}

export async function addNonFollowers(usernames: string[]): Promise<void> {
  if (!usernames || usernames.length === 0) {
    return;
  }

  // Remove duplicates
  const uniqueUsernames = [...new Set(usernames.map((u) => u.trim()))];

  // Filter out whitelisted users
  const filteredUsernames: string[] = [];
  for (const username of uniqueUsernames) {
    const inWhitelist = await isInWhitelist(username);
    if (!inWhitelist) {
      filteredUsernames.push(username);
    }
  }

  if (filteredUsernames.length === 0) {
    return;
  }

  // Batch insert
  const values = filteredUsernames.map((username) => [username]);
  const placeholders = values.map(() => '(?)').join(',');

  try {
    await pool.query(
      `INSERT IGNORE INTO non_followers (username) VALUES ${placeholders}`,
      values.flat()
    );
  } catch (error) {
    throw new Error('Failed to add non-followers to database');
  }
}

export async function getNonFollowers(): Promise<NonFollowerRow[]> {
  const [rows] = await pool.execute<NonFollowerRow[]>(
    'SELECT username, created_at FROM non_followers ORDER BY created_at DESC'
  );

  return rows;
}

export async function removeNonFollower(username: string): Promise<void> {
  if (!username || username.trim() === '') {
    throw new Error('Username cannot be empty');
  }

  const [result] = await pool.execute<ResultSetHeader>(
    'DELETE FROM non_followers WHERE username = ?',
    [username.trim()]
  );

  if (result.affectedRows === 0) {
    throw new Error('Username not found in non-followers list');
  }
}

export async function clearNonFollowers(): Promise<void> {
  await pool.execute('DELETE FROM non_followers');
}