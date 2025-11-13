import { Request, Response } from 'express';
import {
  moveToExFollowers,
  getExFollowers,
  removeExFollower
} from '../services/exFollowers';
import { ApiError } from '../middleware/errorHandler';

/**
 * Get all ex-followers
 * GET /api/ex-followers
 */
export const getAllExFollowers = async (req: Request, res: Response) => {
  try {
    const exFollowers = await getExFollowers();

    res.status(200).json({
      success: true,
      data: {
        count: exFollowers.length,
        exFollowers: exFollowers
      }
    });
  } catch (error) {
    throw new ApiError(500, error instanceof Error ? error.message : 'Failed to fetch ex-followers');
  }
};

/**
 * Move user from non-followers to ex-followers
 * POST /api/ex-followers
 * Body: { username: string }
 */
export const addToExFollowers = async (req: Request, res: Response) => {
  try {
    const { username } = req.body;

    if (!username) {
      throw new ApiError(400, 'Username is required');
    }

    await moveToExFollowers(username);

    res.status(201).json({
      success: true,
      message: `User ${username} moved to ex-followers`,
      data: { username }
    });
  } catch (error) {
    throw new ApiError(400, error instanceof Error ? error.message : 'Failed to move user to ex-followers');
  }
};

/**
 * Move multiple users to ex-followers
 * POST /api/ex-followers/bulk
 * Body: { usernames: string[] }
 */
export const addBulkToExFollowers = async (req: Request, res: Response) => {
  try {
    const { usernames } = req.body;

    if (!usernames || !Array.isArray(usernames)) {
      throw new ApiError(400, 'usernames must be an array');
    }

    if (usernames.length === 0) {
      throw new ApiError(400, 'usernames array cannot be empty');
    }

    const results = {
      moved: [] as string[],
      failed: [] as { username: string; reason: string }[]
    };

    for (const username of usernames) {
      try {
        await moveToExFollowers(username);
        results.moved.push(username);
      } catch (error) {
        results.failed.push({
          username,
          reason: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    res.status(200).json({
      success: true,
      message: `Moved ${results.moved.length} users to ex-followers`,
      data: results
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(400, error instanceof Error ? error.message : 'Failed to move users to ex-followers');
  }
};

/**
 * Remove user from ex-followers
 * DELETE /api/ex-followers/:username
 */
export const deleteExFollower = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;

    if (!username) {
      throw new ApiError(400, 'Username parameter is required');
    }

    await removeExFollower(username);

    res.status(200).json({
      success: true,
      message: `User ${username} removed from ex-followers`,
      data: { username }
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      throw new ApiError(404, error.message);
    }
    throw new ApiError(400, error instanceof Error ? error.message : 'Failed to remove ex-follower');
  }
};
