import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { removeNonFollower } from './nonFollowers';

interface ExFollowerRow extends RowDataPacket {
  username: string;
  unfollowed_at: Date;
}

export async function moveToExFollowers(userId: number, username: string): Promise<void> {
  if (!userId || userId <= 0) {
    throw new Error('Valid userId is required');
  }
  if (!username || username.trim() === '') {
    throw new Error('Username cannot be empty');
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Insert into ex_followers
    await connection.execute<ResultSetHeader>(
      'INSERT IGNORE INTO ex_followers (user_id, username) VALUES (?, ?)',
      [userId, username.trim()]
    );

    // Remove from non_followers if exists
    await connection.execute<ResultSetHeader>(
      'DELETE FROM non_followers WHERE user_id = ? AND username = ?',
      [userId, username.trim()]
    );

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw new Error('Failed to move username to ex-followers');
  } finally {
    connection.release();
  }
}

export async function getExFollowers(
  userId: number
): Promise<Array<{ username: string; unfollowed_at: Date }>> {
  if (!userId || userId <= 0) {
    throw new Error('Valid userId is required');
  }

  const [rows] = await pool.execute<ExFollowerRow[]>(
    'SELECT username, unfollowed_at FROM ex_followers WHERE user_id = ? ORDER BY unfollowed_at DESC',
    [userId]
  );

  return rows.map((row) => ({
    username: row.username,
    unfollowed_at: row.unfollowed_at,
  }));
}

export async function removeExFollower(userId: number, username: string): Promise<void> {
  if (!userId || userId <= 0) {
    throw new Error('Valid userId is required');
  }
  if (!username || username.trim() === '') {
    throw new Error('Username cannot be empty');
  }

  const [result] = await pool.execute<ResultSetHeader>(
    'DELETE FROM ex_followers WHERE user_id = ? AND username = ?',
    [userId, username.trim()]
  );

  if (result.affectedRows === 0) {
    throw new Error('Username not found in ex-followers list');
  }
}
