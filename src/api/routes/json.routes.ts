import { Router } from 'express';
import * as jsonController from '../controllers/json.controller';

const router = Router();

// POST /api/json/parse - Parse Instagram JSON
router.post('/parse', jsonController.parseJson);

export default router;
