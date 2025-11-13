import { Request, Response } from 'express';
import {
  addToWhitelist,
  removeFromWhitelist,
  getWhitelist,
  isInWhitelist
} from '../services/whitelist';
import { ApiError } from '../middleware/errorHandler';

/**
 * Get all whitelisted users
 * GET /api/whitelist
 */
export const getAllWhitelist = async (req: Request, res: Response) => {
  try {
    const usernames = await getWhitelist();

    res.status(200).json({
      success: true,
      data: {
        count: usernames.length,
        usernames: usernames
      }
    });
  } catch (error) {
    throw new ApiError(500, error instanceof Error ? error.message : 'Failed to fetch whitelist');
  }
};

/**
 * Add user to whitelist
 * POST /api/whitelist
 * Body: { username: string }
 */
export const addUserToWhitelist = async (req: Request, res: Response) => {
  try {
    const { username } = req.body;

    await addToWhitelist(username);

    res.status(201).json({
      success: true,
      message: `User ${username} added to whitelist`,
      data: { username }
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('already exists')) {
      throw new ApiError(409, error.message);
    }
    throw new ApiError(400, error instanceof Error ? error.message : 'Failed to add user to whitelist');
  }
};

/**
 * Remove user from whitelist
 * DELETE /api/whitelist/:username
 */
export const removeUserFromWhitelist = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;

    if (!username) {
      throw new ApiError(400, 'Username parameter is required');
    }

    await removeFromWhitelist(username);

    res.status(200).json({
      success: true,
      message: `User ${username} removed from whitelist`,
      data: { username }
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      throw new ApiError(404, error.message);
    }
    throw new ApiError(400, error instanceof Error ? error.message : 'Failed to remove user from whitelist');
  }
};

/**
 * Check if user is in whitelist
 * GET /api/whitelist/:username
 */
export const checkWhitelist = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;

    if (!username) {
      throw new ApiError(400, 'Username parameter is required');
    }

    const isWhitelisted = await isInWhitelist(username);

    res.status(200).json({
      success: true,
      data: {
        username,
        isWhitelisted
      }
    });
  } catch (error) {
    throw new ApiError(400, error instanceof Error ? error.message : 'Failed to check whitelist');
  }
};

/**
 * Add multiple users to whitelist
 * POST /api/whitelist/bulk
 * Body: { usernames: string[] }
 */
export const addBulkToWhitelist = async (req: Request, res: Response) => {
  try {
    const { usernames } = req.body;

    const results = {
      added: [] as string[],
      failed: [] as { username: string; reason: string }[]
    };

    for (const username of usernames) {
      try {
        await addToWhitelist(username);
        results.added.push(username);
      } catch (error) {
        results.failed.push({
          username,
          reason: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    res.status(200).json({
      success: true,
      message: `Added ${results.added.length} users to whitelist`,
      data: results
    });
  } catch (error) {
    throw new ApiError(400, error instanceof Error ? error.message : 'Failed to add users to whitelist');
  }
};
