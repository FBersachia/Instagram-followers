import { Request, Response } from 'express';
import { parseInstagramJson, extractUsernames } from '../services/jsonParser';
import { ApiError } from '../middleware/errorHandler';

// In-memory storage for extracted usernames
// In production, this should be stored in Redis or database
let extractedUsersCache: string[] = [];

/**
 * Upload and parse Instagram JSON file
 * POST /api/json/upload
 */
export const uploadJson = async (req: Request, res: Response) => {
  try {
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

    // Store in cache
    extractedUsersCache = usernames;

    res.status(200).json({
      success: true,
      message: `Successfully extracted ${usernames.length} usernames`,
      data: {
        count: usernames.length,
        usernames: usernames
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
      count: extractedUsersCache.length,
      usernames: extractedUsersCache
    }
  });
};

/**
 * Clear extracted users cache
 * DELETE /api/users/extracted
 */
export const clearExtractedUsers = async (req: Request, res: Response) => {
  extractedUsersCache = [];
  res.status(200).json({
    success: true,
    message: 'Extracted users cache cleared'
  });
};
