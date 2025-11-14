import { Request, Response, NextFunction } from 'express';
import { getStats as getStatsService } from '../../services/stats';

export const getStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const stats = await getStatsService(userId);

    res.json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    next(error);
  }
};
