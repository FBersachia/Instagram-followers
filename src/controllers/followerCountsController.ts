import { Request, Response } from 'express';
import {
  addFollowerCount,
  getFollowerCounts,
  getLatestFollowerCount,
  deleteFollowerCount
} from '../services/followerCounts';
import { ApiError } from '../middleware/errorHandler';

/**
 * Get all follower counts
 * GET /api/follower-counts
 */
export const getAllFollowerCounts = async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
    const counts = await getFollowerCounts(limit);

    res.status(200).json({
      success: true,
      data: {
        count: counts.length,
        followerCounts: counts
      }
    });
  } catch (error) {
    throw new ApiError(500, error instanceof Error ? error.message : 'Failed to fetch follower counts');
  }
};

/**
 * Get latest follower count
 * GET /api/follower-counts/latest
 */
export const getLatestCount = async (req: Request, res: Response) => {
  try {
    const latest = await getLatestFollowerCount();

    res.status(200).json({
      success: true,
      data: latest
    });
  } catch (error) {
    throw new ApiError(500, error instanceof Error ? error.message : 'Failed to fetch latest follower count');
  }
};

/**
 * Add a new follower count
 * POST /api/follower-counts
 * Body: { count: number }
 */
export const addCount = async (req: Request, res: Response) => {
  try {
    const { count } = req.body;

    if (!count && count !== 0) {
      throw new ApiError(400, 'Count is required');
    }

    const countNum = parseInt(count);
    if (isNaN(countNum) || countNum < 0) {
      throw new ApiError(400, 'Count must be a positive number');
    }

    await addFollowerCount(countNum);

    res.status(201).json({
      success: true,
      message: `Follower count ${countNum} recorded successfully`,
      data: { count: countNum }
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(400, error instanceof Error ? error.message : 'Failed to add follower count');
  }
};

/**
 * Delete a follower count record
 * DELETE /api/follower-counts/:id
 */
export const deleteCount = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new ApiError(400, 'ID parameter is required');
    }

    const idNum = parseInt(id);
    if (isNaN(idNum)) {
      throw new ApiError(400, 'ID must be a number');
    }

    await deleteFollowerCount(idNum);

    res.status(200).json({
      success: true,
      message: `Follower count record deleted`,
      data: { id: idNum }
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      throw new ApiError(404, error.message);
    }
    throw new ApiError(400, error instanceof Error ? error.message : 'Failed to delete follower count');
  }
};
