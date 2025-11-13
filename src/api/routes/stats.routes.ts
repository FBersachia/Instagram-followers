import { Router } from 'express';
import * as statsController from '../controllers/stats.controller';

const router = Router();

// GET /api/stats - Get statistics
router.get('/', statsController.getStats);

export default router;
