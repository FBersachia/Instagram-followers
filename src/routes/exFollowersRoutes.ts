import { Router } from 'express';
import {
  getAllExFollowers,
  addToExFollowers,
  addBulkToExFollowers,
  deleteExFollower
} from '../controllers/exFollowersController';
import { asyncHandler } from '../middleware/errorHandler';
import { validateRequiredFields, validateUsername, validateUsernamesArray } from '../middleware/validation';

const router = Router();

// GET /api/ex-followers - Get all ex-followers
router.get('/', asyncHandler(getAllExFollowers));

// POST /api/ex-followers - Move user to ex-followers
router.post('/', validateRequiredFields(['username']), validateUsername, asyncHandler(addToExFollowers));

// POST /api/ex-followers/bulk - Move multiple users to ex-followers
router.post('/bulk', validateUsernamesArray, asyncHandler(addBulkToExFollowers));

// DELETE /api/ex-followers/:username - Remove user from ex-followers
router.delete('/:username', asyncHandler(deleteExFollower));

export default router;
