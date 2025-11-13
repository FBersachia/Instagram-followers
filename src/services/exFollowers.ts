import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { removeNonFollower } from './nonFollowers';

interface ExFollowerRow extends RowDataPacket {
  username: string;
  unfollowed_at: Date;
}

export async function moveToExFollowers(username: string): Promise<void> {
  if (!username || username.trim() === '') {
    throw new Error('Username cannot be empty');
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Insert into ex_followers
    await connection.execute<ResultSetHeader>(
      'INSERT IGNORE INTO ex_followers (username) VALUES (?)',
      [username.trim()]
    );

    // Remove from non_followers if exists
    await connection.execute<ResultSetHeader>(
      'DELETE FROM non_followers WHERE username = ?',
      [username.trim()]
    );

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw new Error('Failed to move username to ex-followers');
  } finally {
    connection.release();
  }
}

export async function getExFollowers(): Promise<
  Array<{ username: string; unfollowed_at: Date }>
> {
  const [rows] = await pool.execute<ExFollowerRow[]>(
    'SELECT username, unfollowed_at FROM ex_followers ORDER BY unfollowed_at DESC'
  );

  return rows.map((row) => ({
    username: row.username,
    unfollowed_at: row.unfollowed_at,
  }));
}

export async function removeExFollower(username: string): Promise<void> {
  if (!username || username.trim() === '') {
    throw new Error('Username cannot be empty');
  }

  const [result] = await pool.execute<ResultSetHeader>(
    'DELETE FROM ex_followers WHERE username = ?',
    [username.trim()]
  );

  if (result.affectedRows === 0) {
    throw new Error('Username not found in ex-followers list');
  }
}