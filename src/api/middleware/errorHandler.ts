import { Request, Response, NextFunction } from 'express';
import logger from '../../config/logger';

interface ErrorWithStatus extends Error {
  status?: number;
  statusCode?: number;
}

const errorHandler = (
  err: ErrorWithStatus,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error with context
  logger.error('API Error:', {
    message: err.message,
    status: err.status || err.statusCode || 500,
    method: req.method,
    path: req.path,
    ip: req.ip,
    stack: err.stack
  });

  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorHandler;
