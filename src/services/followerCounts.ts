import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface FollowerCountRow extends RowDataPacket {
  id: number;
  count: number;
  recorded_at: Date;
  created_at: Date;
}

export async function addFollowerCount(count: number): Promise<void> {
  if (!count || count < 0) {
    throw new Error('Count must be a positive number');
  }

  try {
    await pool.execute<ResultSetHeader>(
      'INSERT INTO follower_counts (count) VALUES (?)',
      [count]
    );
  } catch (error) {
    throw new Error('Failed to add follower count to database');
  }
}

export async function getFollowerCounts(limit: number = 100): Promise<FollowerCountRow[]> {
  // Ensure limit is a valid positive integer
  const safeLimit = Math.max(1, Math.min(1000, Math.floor(limit)));

  const [rows] = await pool.query<FollowerCountRow[]>(
    `SELECT id, count, recorded_at, created_at FROM follower_counts ORDER BY recorded_at DESC LIMIT ${safeLimit}`
  );

  return rows;
}

export async function getLatestFollowerCount(): Promise<FollowerCountRow | null> {
  const [rows] = await pool.execute<FollowerCountRow[]>(
    'SELECT id, count, recorded_at, created_at FROM follower_counts ORDER BY recorded_at DESC LIMIT 1'
  );

  return rows.length > 0 ? rows[0]! : null;
}

export async function deleteFollowerCount(id: number): Promise<void> {
  const [result] = await pool.execute<ResultSetHeader>(
    'DELETE FROM follower_counts WHERE id = ?',
    [id]
  );

  if (result.affectedRows === 0) {
    throw new Error('Follower count record not found');
  }
}
