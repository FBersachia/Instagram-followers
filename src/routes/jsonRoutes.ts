import { Router } from 'express';
import multer from 'multer';
import { uploadJson } from '../controllers/jsonController';
import { asyncHandler } from '../middleware/errorHandler';
import { validateFileUpload } from '../middleware/validation';

const router = Router();

// Configure multer for file upload (store in memory)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/json' || file.originalname.endsWith('.json')) {
      cb(null, true);
    } else {
      cb(new Error('Only JSON files are allowed'));
    }
  }
});

// POST /api/json/upload - Upload and parse JSON file
router.post('/upload', upload.single('file'), validateFileUpload, asyncHandler(uploadJson));

export default router;
