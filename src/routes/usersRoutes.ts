import { Router } from 'express';
import { getExtractedUsers, clearExtractedUsers } from '../controllers/jsonController';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// GET /api/users/extracted - Get extracted usernames
router.get('/extracted', asyncHandler(getExtractedUsers));

// DELETE /api/users/extracted - Clear extracted usernames cache
router.delete('/extracted', asyncHandler(clearExtractedUsers));

export default router;
