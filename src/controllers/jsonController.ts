import { Request, Response } from 'express';
import { parseInstagramJson, extractUsernames } from '../services/jsonParser';
import { getWhitelist } from '../services/whitelist';
import { ApiError } from '../middleware/errorHandler';

// In-memory storage for extracted usernames per authenticated user
// In production, this should be stored in Redis or database
const extractedUsersCache: Record<number, string[]> = {};

/**
 * Upload and parse Instagram JSON file
 * POST /api/json/upload
 */
export const uploadJson = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApiError(401, 'Unauthorized');
    }

    if (!req.file) {
      throw new ApiError(400, 'No file uploaded');
    }

    // Read file content
    const fileContent = req.file.buffer.toString('utf-8');

    // Parse JSON
    const parsedData = parseInstagramJson(fileContent);

    // Extract usernames
    const usernames = extractUsernames(parsedData);

    if (usernames.length === 0) {
      throw new ApiError(400, 'No usernames found in the provided JSON file');
    }

    // Get whitelist for current user and filter out whitelisted users
    const whitelist = await getWhitelist(userId);
    const whitelistSet = new Set(whitelist);
    const filteredUsernames = usernames.filter(username => !whitelistSet.has(username));

    // Store filtered usernames in cache for this user
    extractedUsersCache[userId] = filteredUsernames;

    res.status(200).json({
      success: true,
      message: `Successfully extracted ${filteredUsernames.length} usernames (${usernames.length - filteredUsernames.length} filtered from whitelist)`,
      data: {
        count: filteredUsernames.length,
        usernames: filteredUsernames
      }
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(400, error instanceof Error ? error.message : 'Failed to process JSON file');
  }
};

/**
 * Get extracted usernames from cache
 * GET /api/users/extracted
 */
export const getExtractedUsers = async (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: {
      count: req.user?.userId ? extractedUsersCache[req.user.userId]?.length ?? 0 : 0,
      usernames: req.user?.userId ? extractedUsersCache[req.user.userId] ?? [] : []
    }
  });
};

/**
 * Clear extracted users cache
 * DELETE /api/users/extracted
 */
export const clearExtractedUsers = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (userId) {
    delete extractedUsersCache[userId];
  }
  res.status(200).json({
    success: true,
    message: 'Extracted users cache cleared'
  });
};
