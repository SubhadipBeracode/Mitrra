import express from 'express';
import {
  signup,
  login,
  getMe,
  updateProfile,
  uploadAvatar,
  changePassword,
  deleteAccount,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/signup', authLimiter, signup);
router.post('/login', authLimiter, login);
router.get('/me', protect, getMe);
router.patch('/profile', protect, updateProfile);
router.post('/avatar', protect, upload.single('avatar'), uploadAvatar);
router.patch('/change-password', protect, changePassword);
router.delete('/account', protect, deleteAccount);

export default router;