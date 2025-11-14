import { Request, Response, NextFunction } from 'express';
import {
  addNonFollowers,
  getNonFollowers,
  removeNonFollower,
} from '../../services/nonFollowers';

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const nonFollowers = await getNonFollowers(userId);
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
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { usernames } = req.body;

    if (!usernames || !Array.isArray(usernames)) {
      return res.status(400).json({ error: 'Usernames array is required' });
    }

    await addNonFollowers(userId, usernames);
    res.status(201).json({
      success: true,
      message: 'Inserted usernames to non-followers list (excluding whitelisted)',
    });
  } catch (error: any) {
    next(error);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { username } = req.params;

    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    await removeNonFollower(userId, username);
    res.json({
      success: true,
      message: `Removed "${username}" from non-followers`,
    });
  } catch (error: any) {
    next(error);
  }
};
