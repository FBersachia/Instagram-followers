import { Request, Response, NextFunction } from 'express';
import { addNonFollowers, getNonFollowers } from '../../services/nonFollowers';
import pool from '../../config/database';

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const nonFollowers = await getNonFollowers();
    res.json({
      success: true,
      count: nonFollowers.length,
      data: nonFollowers,
    });
  } catch (error: any) {
    next(error);
  }
};

export const insertBulk = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { usernames } = req.body;

    if (!usernames || !Array.isArray(usernames)) {
      return res.status(400).json({ error: 'Usernames array is required' });
    }

    await addNonFollowers(usernames);
    res.status(201).json({
      success: true,
      message: `Inserted usernames to non-followers list (excluding whitelisted)`,
    });
  } catch (error: any) {
    next(error);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username } = req.params;

    await pool.query('DELETE FROM non_followers WHERE username = ?', [username]);
    res.json({
      success: true,
      message: `Removed "${username}" from non-followers`,
    });
  } catch (error: any) {
    next(error);
  }
};
