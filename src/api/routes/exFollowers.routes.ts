import { Router } from 'express';
import * as exFollowersController from '../controllers/exFollowers.controller';

const router = Router();

// GET /api/ex-followers - Get all ex-followers
router.get('/', exFollowersController.getAll);

// POST /api/ex-followers - Move user from non-followers to ex-followers
router.post('/', exFollowersController.moveFromNonFollowers);

// DELETE /api/ex-followers/:username - Delete specific ex-follower
router.delete('/:username', exFollowersController.remove);

export default router;
