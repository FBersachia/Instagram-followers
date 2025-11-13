import { Router } from 'express';
import {
  getAllFollowerCounts,
  getLatestCount,
  addCount,
  deleteCount
} from '../controllers/followerCountsController';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// GET /api/follower-counts - Get all follower counts
router.get('/', asyncHandler(getAllFollowerCounts));

// GET /api/follower-counts/latest - Get latest follower count
router.get('/latest', asyncHandler(getLatestCount));

// POST /api/follower-counts - Add a new follower count
router.post('/', asyncHandler(addCount));

// DELETE /api/follower-counts/:id - Delete a follower count record
router.delete('/:id', asyncHandler(deleteCount));

export default router;
