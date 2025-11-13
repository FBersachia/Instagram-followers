import { Router } from 'express';
import * as whitelistController from '../controllers/whitelist.controller';

const router = Router();

// GET /api/whitelist - Get all whitelist entries
router.get('/', whitelistController.getAll);

// POST /api/whitelist - Add username to whitelist
router.post('/', whitelistController.add);

// DELETE /api/whitelist/:username - Remove from whitelist
router.delete('/:username', whitelistController.remove);

export default router;
