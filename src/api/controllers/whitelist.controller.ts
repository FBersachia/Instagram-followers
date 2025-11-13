import { Request, Response, NextFunction } from 'express';
import { addToWhitelist, getWhitelist, removeFromWhitelist } from '../../services/whitelist';

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const whitelist = await getWhitelist();
    res.json({
      success: true,
      count: whitelist.length,
      data: whitelist,
    });
  } catch (error: any) {
    next(error);
  }
};

export const add = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    await addToWhitelist(username);
    res.status(201).json({
      success: true,
      message: `Added "${username}" to whitelist`,
    });
  } catch (error: any) {
    next(error);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    await removeFromWhitelist(username);
    res.json({
      success: true,
      message: `Removed "${username}" from whitelist`,
    });
  } catch (error: any) {
    next(error);
  }
};
