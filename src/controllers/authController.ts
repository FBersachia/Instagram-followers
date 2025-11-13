import { Request, Response } from 'express';
import { authenticateUser } from '../services/auth';
import logger from '../config/logger';

/**
 * Login controller
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Username and password are required',
      });
      return;
    }

    // Authenticate user
    const authResult = await authenticateUser(username, password);

    if (!authResult) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid username or password',
      });
      return;
    }

    res.status(200).json({
      message: 'Login successful',
      token: authResult.token,
      user: authResult.user,
    });
  } catch (error) {
    logger.error('Error in login controller:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Login failed',
    });
  }
};

/**
 * Get current user info (requires authentication)
 */
export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // User info is already attached by authMiddleware
    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated',
      });
      return;
    }

    res.status(200).json({
      user: req.user,
    });
  } catch (error) {
    logger.error('Error in getCurrentUser controller:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get user information',
    });
  }
};

/**
 * Logout controller (client-side token removal)
 */
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    // With JWT, logout is handled client-side by removing the token
    // We just log the event
    if (req.user) {
      logger.info(`User logged out: ${req.user.username}`);
    }

    res.status(200).json({
      message: 'Logout successful',
    });
  } catch (error) {
    logger.error('Error in logout controller:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Logout failed',
    });
  }
};
