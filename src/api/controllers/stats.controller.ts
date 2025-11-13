import { Request, Response, NextFunction } from 'express';
import pool from '../../config/database';

export const getStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get counts from all tables
    const [whitelistCount] = await pool.query<any[]>(
      'SELECT COUNT(*) as count FROM whitelist'
    );
    const [nonFollowersCount] = await pool.query<any[]>(
      'SELECT COUNT(*) as count FROM non_followers'
    );
    const [exFollowersCount] = await pool.query<any[]>(
      'SELECT COUNT(*) as count FROM ex_followers'
    );

    // Get recent ex-followers (last 10)
    const [recentExFollowers] = await pool.query<any[]>(
      'SELECT username, unfollowed_at FROM ex_followers ORDER BY unfollowed_at DESC LIMIT 10'
    );

    // Get oldest and newest entries for date ranges
    const [nonFollowersDateRange] = await pool.query<any[]>(
      'SELECT MIN(created_at) as oldest, MAX(created_at) as newest FROM non_followers'
    );
    const [exFollowersDateRange] = await pool.query<any[]>(
      'SELECT MIN(unfollowed_at) as oldest, MAX(unfollowed_at) as newest FROM ex_followers'
    );

    res.json({
      success: true,
      data: {
        counts: {
          whitelist: whitelistCount[0].count,
          nonFollowers: nonFollowersCount[0].count,
          exFollowers: exFollowersCount[0].count,
          total: nonFollowersCount[0].count + exFollowersCount[0].count,
        },
        recentUnfollows: recentExFollowers,
        dateRanges: {
          nonFollowers: nonFollowersDateRange[0],
          exFollowers: exFollowersDateRange[0],
        },
      },
    });
  } catch (error: any) {
    next(error);
  }
};
