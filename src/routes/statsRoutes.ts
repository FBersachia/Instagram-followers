import { Router } from 'express';
import { getStatistics } from '../controllers/statsController';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// GET /api/stats - Get statistics
router.get('/', asyncHandler(getStatistics));

export default router;
