import { Router } from 'express';
import {
  getAllNonFollowers,
  insertNonFollowers,
  deleteNonFollower,
  clearAllNonFollowers
} from '../controllers/nonFollowersController';
import { asyncHandler } from '../middleware/errorHandler';
import { validateUsernamesArray } from '../middleware/validation';

const router = Router();

// GET /api/non-followers - Get all non-followers
router.get('/', asyncHandler(getAllNonFollowers));

// POST /api/non-followers - Add non-followers (filtered by whitelist)
router.post('/', validateUsernamesArray, asyncHandler(insertNonFollowers));

// DELETE /api/non-followers - Clear all non-followers
router.delete('/', asyncHandler(clearAllNonFollowers));

// DELETE /api/non-followers/:username - Remove specific non-follower
router.delete('/:username', asyncHandler(deleteNonFollower));

export default router;
