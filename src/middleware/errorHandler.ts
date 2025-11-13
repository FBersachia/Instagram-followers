import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';

/**
 * Custom API Error class
 */
export class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}

/**
 * Async handler wrapper to catch errors in async route handlers
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Not found error handler
 */
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error = new ApiError(404, `Route ${req.method} ${req.originalUrl} not found`);
  next(error);
};

/**
 * Global error handler
 */
export const errorHandler = (err: Error | ApiError, req: Request, res: Response, next: NextFunction) => {
  // Log error details
  const errorInfo = {
    message: err.message,
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    stack: err.stack
  };

  if (err instanceof ApiError) {
    // Log API errors as warnings (expected errors)
    logger.warn('API Error:', errorInfo);
    return res.status(err.statusCode).json({
      error: err.name,
      message: err.message
    });
  }

  // Database errors
  if (err.message.includes('ER_DUP_ENTRY')) {
    logger.warn('Database conflict error:', errorInfo);
    return res.status(409).json({
      error: 'Conflict',
      message: 'Record already exists'
    });
  }

  // Log unexpected errors as errors
  logger.error('Unexpected error:', errorInfo);

  // Default error
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
};
