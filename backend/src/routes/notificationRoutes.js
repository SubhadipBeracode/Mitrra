import express from 'express';
import { updateNotificationSettings } from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.patch('/settings', updateNotificationSettings);

export default router;