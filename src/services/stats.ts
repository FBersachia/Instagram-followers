import pool from '../config/database';
import { RowDataPacket } from 'mysql2';

interface CountRow extends RowDataPacket {
  count: number;
}

interface RecentExFollowerRow extends RowDataPacket {
  username: string;
  unfollowed_at: Date;
}

export interface Stats {
  whitelist: {
    count: number;
  };
  nonFollowers: {
    count: number;
  };
  exFollowers: {
    count: number;
    recent: Array<{
      username: string;
      unfollowed_at: Date;
    }>;
  };
  totalTracked: number;
}

export async function getStats(userId: number): Promise<Stats> {
  try {
    // Get whitelist count
    const [whitelistRows] = await pool.execute<CountRow[]>(
      'SELECT COUNT(*) as count FROM whitelist WHERE user_id = ?',
      [userId]
    );
    const whitelistCount = whitelistRows[0]?.count ?? 0;

    // Get non-followers count
    const [nonFollowersRows] = await pool.execute<CountRow[]>(
      'SELECT COUNT(*) as count FROM non_followers WHERE user_id = ?',
      [userId]
    );
    const nonFollowersCount = nonFollowersRows[0]?.count ?? 0;

    // Get ex-followers count
    const [exFollowersRows] = await pool.execute<CountRow[]>(
      'SELECT COUNT(*) as count FROM ex_followers WHERE user_id = ?',
      [userId]
    );
    const exFollowersCount = exFollowersRows[0]?.count ?? 0;

    // Get recent ex-followers (last 10)
    const [recentExFollowers] = await pool.execute<RecentExFollowerRow[]>(
      'SELECT username, unfollowed_at FROM ex_followers WHERE user_id = ? ORDER BY unfollowed_at DESC LIMIT 10',
      [userId]
    );

    return {
      whitelist: {
        count: whitelistCount
      },
      nonFollowers: {
        count: nonFollowersCount
      },
      exFollowers: {
        count: exFollowersCount,
        recent: recentExFollowers.map(row => ({
          username: row.username,
          unfollowed_at: row.unfollowed_at
        }))
      },
      totalTracked: nonFollowersCount + exFollowersCount
    };
  } catch (error) {
    throw new Error('Failed to fetch statistics');
  }
}
