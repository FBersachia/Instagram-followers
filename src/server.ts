import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import jsonRoutes from './routes/jsonRoutes';
import usersRoutes from './routes/usersRoutes';
import whitelistRoutes from './routes/whitelistRoutes';
import nonFollowersRoutes from './routes/nonFollowersRoutes';
import exFollowersRoutes from './routes/exFollowersRoutes';
import statsRoutes from './routes/statsRoutes';
import followerCountsRoutes from './routes/followerCountsRoutes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import requestLogger from './middleware/requestLogger';
import { authenticateToken } from './middleware/authMiddleware';
import logger from './config/logger';

// Load environment variables
dotenv.config();

// Create Express application
const app: Application = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use(requestLogger);

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    name: 'Instagram Follower Tracker API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      auth: '/api/auth/*',
      json: '/api/json/*',
      whitelist: '/api/whitelist/*',
      nonFollowers: '/api/non-followers/*',
      exFollowers: '/api/ex-followers/*',
      stats: '/api/stats',
      followerCounts: '/api/follower-counts/*'
    },
    documentation: 'See API.md for full documentation'
  });
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// API Routes
// Public routes
app.use('/api/auth', authRoutes);

// Protected routes (require authentication)
app.use('/api/json', authenticateToken, jsonRoutes);
app.use('/api/users', authenticateToken, usersRoutes);
app.use('/api/whitelist', authenticateToken, whitelistRoutes);
app.use('/api/non-followers', authenticateToken, nonFollowersRoutes);
app.use('/api/ex-followers', authenticateToken, exFollowersRoutes);
app.use('/api/stats', authenticateToken, statsRoutes);
app.use('/api/follower-counts', authenticateToken, followerCountsRoutes);

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

export default app;
