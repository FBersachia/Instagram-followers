import { Request, Response, NextFunction } from 'express';
import { verifyToken, getUserById } from '../services/auth';
import logger from '../config/logger';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        username: string;
      };
    }
  }
}

/**
 * Middleware to verify JWT token and authenticate requests
 */
export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'No token provided',
      });
      return;
    }

    // Verify token
    const payload = verifyToken(token);

    if (!payload) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired token',
      });
      return;
    }

    // Verify user still exists and is active
    const user = await getUserById(payload.userId);

    if (!user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'User not found or inactive',
      });
      return;
    }

    // Attach user info to request
    req.user = {
      userId: payload.userId,
      username: payload.username,
    };

    next();
  } catch (error) {
    logger.error('Error in authentication middleware:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Authentication failed',
    });
  }
};

/**
 * Optional authentication middleware - continues even if no token
 */
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const payload = verifyToken(token);
      if (payload) {
        const user = await getUserById(payload.userId);
        if (user) {
          req.user = {
            userId: payload.userId,
            username: payload.username,
          };
        }
      }
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};
