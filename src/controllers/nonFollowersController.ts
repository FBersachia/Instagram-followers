import { Request, Response } from 'express';
import {
  addNonFollowers,
  getNonFollowers,
  removeNonFollower,
  clearNonFollowers
} from '../services/nonFollowers';
import { ApiError } from '../middleware/errorHandler';

/**
 * Get all non-followers
 * GET /api/non-followers
 */
export const getAllNonFollowers = async (req: Request, res: Response) => {
  try {
    const nonFollowers = await getNonFollowers();

    res.status(200).json({
      success: true,
      data: {
        count: nonFollowers.length,
        nonFollowers: nonFollowers
      }
    });
  } catch (error) {
    throw new ApiError(500, error instanceof Error ? error.message : 'Failed to fetch non-followers');
  }
};

/**
 * Add non-followers (filtered by whitelist)
 * POST /api/non-followers
 * Body: { usernames: string[] }
 */
export const insertNonFollowers = async (req: Request, res: Response) => {
  try {
    const { usernames } = req.body;

    if (!usernames || !Array.isArray(usernames)) {
      throw new ApiError(400, 'usernames must be an array');
    }

    if (usernames.length === 0) {
      throw new ApiError(400, 'usernames array cannot be empty');
    }

    await addNonFollowers(usernames);

    res.status(201).json({
      success: true,
      message: `Non-followers added successfully (whitelisted users filtered out)`,
      data: {
        submitted: usernames.length
      }
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(400, error instanceof Error ? error.message : 'Failed to add non-followers');
  }
};

/**
 * Remove a non-follower
 * DELETE /api/non-followers/:username
 */
export const deleteNonFollower = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;

    if (!username) {
      throw new ApiError(400, 'Username parameter is required');
    }

    await removeNonFollower(username);

    res.status(200).json({
      success: true,
      message: `User ${username} removed from non-followers`,
      data: { username }
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      throw new ApiError(404, error.message);
    }
    throw new ApiError(400, error instanceof Error ? error.message : 'Failed to remove non-follower');
  }
};

/**
 * Clear all non-followers
 * DELETE /api/non-followers
 */
export const clearAllNonFollowers = async (req: Request, res: Response) => {
  try {
    await clearNonFollowers();

    res.status(200).json({
      success: true,
      message: 'All non-followers cleared'
    });
  } catch (error) {
    throw new ApiError(500, error instanceof Error ? error.message : 'Failed to clear non-followers');
  }
};
