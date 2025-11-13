import { Request, Response } from 'express';
import { getStats } from '../services/stats';
import { ApiError } from '../middleware/errorHandler';

/**
 * Get statistics
 * GET /api/stats
 */
export const getStatistics = async (req: Request, res: Response) => {
  try {
    const stats = await getStats();

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    throw new ApiError(500, error instanceof Error ? error.message : 'Failed to fetch statistics');
  }
};
