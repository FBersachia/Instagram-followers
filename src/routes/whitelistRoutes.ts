import { Router } from 'express';
import {
  getAllWhitelist,
  addUserToWhitelist,
  removeUserFromWhitelist,
  checkWhitelist,
  addBulkToWhitelist
} from '../controllers/whitelistController';
import { asyncHandler } from '../middleware/errorHandler';
import { validateRequiredFields, validateUsername, validateUsernamesArray } from '../middleware/validation';

const router = Router();

// GET /api/whitelist - Get all whitelisted users
router.get('/', asyncHandler(getAllWhitelist));

// GET /api/whitelist/:username - Check if user is in whitelist
router.get('/:username', asyncHandler(checkWhitelist));

// POST /api/whitelist - Add user to whitelist
router.post('/', validateRequiredFields(['username']), validateUsername, asyncHandler(addUserToWhitelist));

// POST /api/whitelist/bulk - Add multiple users to whitelist
router.post('/bulk', validateUsernamesArray, asyncHandler(addBulkToWhitelist));

// DELETE /api/whitelist/:username - Remove user from whitelist
router.delete('/:username', asyncHandler(removeUserFromWhitelist));

export default router;
