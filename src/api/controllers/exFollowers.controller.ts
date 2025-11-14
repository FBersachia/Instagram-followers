import { Request, Response, NextFunction } from 'express';
import {
  moveToExFollowers,
  getExFollowers,
  removeExFollower,
} from '../../services/exFollowers';

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const exFollowers = await getExFollowers(userId);
    res.json({
      success: true,
      count: exFollowers.length,
      data: exFollowers,
    });
  } catch (error: any) {
    next(error);
  }
};

export const moveFromNonFollowers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    await moveToExFollowers(userId, username);
    res.status(201).json({
      success: true,
      message: `Moved "${username}" to ex-followers`,
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

    await removeExFollower(userId, username);
    res.json({
      success: true,
      message: `Removed "${username}" from ex-followers`,
    });
  } catch (error: any) {
    next(error);
  }
};
