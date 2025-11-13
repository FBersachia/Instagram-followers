import { Request, Response, NextFunction } from 'express';

/**
 * Validation error class
 */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Validates that required fields are present in request body
 */
export const validateRequiredFields = (fields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const missingFields: string[] = [];

    for (const field of fields) {
      if (!req.body[field]) {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: 'Validation Error',
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    next();
  };
};

/**
 * Validates username format (alphanumeric, dots, underscores)
 */
export const validateUsername = (req: Request, res: Response, next: NextFunction) => {
  const username = req.body.username || req.params.username;

  if (!username) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Username is required'
    });
  }

  // Instagram username rules: alphanumeric, dots, underscores, max 30 characters
  const usernameRegex = /^[a-zA-Z0-9._]{1,30}$/;

  if (!usernameRegex.test(username)) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid username format. Must be alphanumeric with dots/underscores, max 30 characters'
    });
  }

  next();
};

/**
 * Validates file upload
 */
export const validateFileUpload = (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'No file uploaded'
    });
  }

  // Check if file is JSON
  if (req.file.mimetype !== 'application/json' && !req.file.originalname.endsWith('.json')) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'File must be a JSON file'
    });
  }

  next();
};

/**
 * Validates array of usernames
 */
export const validateUsernamesArray = (req: Request, res: Response, next: NextFunction) => {
  const { usernames } = req.body;

  if (!usernames || !Array.isArray(usernames)) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'usernames must be an array'
    });
  }

  if (usernames.length === 0) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'usernames array cannot be empty'
    });
  }

  // Validate each username
  const usernameRegex = /^[a-zA-Z0-9._]{1,30}$/;
  const invalidUsernames = usernames.filter((username: string) => !usernameRegex.test(username));

  if (invalidUsernames.length > 0) {
    return res.status(400).json({
      error: 'Validation Error',
      message: `Invalid usernames: ${invalidUsernames.join(', ')}`
    });
  }

  next();
};
