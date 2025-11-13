import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import pool from '../config/database';
import { RowDataPacket } from 'mysql2';
import logger from '../config/logger';

interface User {
  id: number;
  username: string;
  password_hash: string;
  is_active: boolean;
}

interface AuthPayload {
  userId: number;
  username: string;
}

/**
 * Authenticate user with username and password
 */
export const authenticateUser = async (
  username: string,
  password: string
): Promise<{ token: string; user: { id: number; username: string } } | null> => {
  try {
    // Find user by username
    const [rows] = await pool.query<(User & RowDataPacket)[]>(
      'SELECT id, username, password_hash, is_active FROM users WHERE username = ?',
      [username]
    );

    const user = rows[0];

    if (!user) {
      logger.warn(`Login attempt with non-existent username: ${username}`);
      return null;
    }

    // Check if user is active
    if (!user.is_active) {
      logger.warn(`Login attempt for inactive user: ${username}`);
      return null;
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      logger.warn(`Failed login attempt for user: ${username}`);
      return null;
    }

    // Generate JWT token
    const token = generateToken({ userId: user.id, username: user.username });

    // Update last login timestamp
    await pool.query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);

    logger.info(`Successful login for user: ${username}`);

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
      },
    };
  } catch (error) {
    logger.error('Error authenticating user:', error);
    throw error;
  }
};

/**
 * Generate JWT token
 */
export const generateToken = (payload: AuthPayload): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign(payload, secret, { expiresIn } as SignOptions);
};

/**
 * Verify JWT token
 */
export const verifyToken = (token: string): AuthPayload | null => {
  try {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    const decoded = jwt.verify(token, secret) as AuthPayload;
    return decoded;
  } catch (error) {
    logger.warn('Invalid or expired token');
    return null;
  }
};

/**
 * Get user by ID
 */
export const getUserById = async (userId: number): Promise<{ id: number; username: string } | null> => {
  try {
    const [rows] = await pool.query<(User & RowDataPacket)[]>(
      'SELECT id, username, is_active FROM users WHERE id = ? AND is_active = TRUE',
      [userId]
    );

    const user = rows[0];

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      username: user.username,
    };
  } catch (error) {
    logger.error('Error fetching user:', error);
    throw error;
  }
};
