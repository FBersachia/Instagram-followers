import { Request, Response, NextFunction } from 'express';
import { moveToExFollowers, getExFollowers } from '../../services/exFollowers';
import pool from '../../config/database';

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const exFollowers = await getExFollowers();
    res.json({
      success: true,
      count: exFollowers.length,
      data: exFollowers,
    });
  } catch (error: any) {
    next(error);
  }
};

export const moveFromNonFollowers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    await moveToExFollowers(username);
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
    const { username } = req.params;

    await pool.query('DELETE FROM ex_followers WHERE username = ?', [username]);
    res.json({
      success: true,
      message: `Removed "${username}" from ex-followers`,
    });
  } catch (error: any) {
    next(error);
  }
};
