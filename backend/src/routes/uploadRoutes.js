import express from 'express';
import { upload, handleUpload } from '../controllers/uploadController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, admin, upload.array('images', 5), handleUpload);

export default router;
