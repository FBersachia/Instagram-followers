import { Router } from 'express';
import * as nonFollowersController from '../controllers/nonFollowers.controller';

const router = Router();

// GET /api/non-followers - Get all non-followers
router.get('/', nonFollowersController.getAll);

// POST /api/non-followers - Insert non-followers from list
router.post('/', nonFollowersController.insertBulk);

// DELETE /api/non-followers/:username - Delete specific non-follower
router.delete('/:username', nonFollowersController.remove);

export default router;
