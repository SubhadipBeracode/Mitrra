import express from 'express';
import { getEpisodes, getEpisodeById, updateFeedback, deleteEpisode } from '../controllers/episodeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getEpisodes);
router.get('/:id', getEpisodeById);
router.patch('/:id/feedback', updateFeedback);
router.delete('/:id', deleteEpisode);

export default router;