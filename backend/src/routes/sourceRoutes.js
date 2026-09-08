import express from 'express';
import { getSources, createSource, deleteSource } from '../controllers/sourceController.js';
import { generateEpisodeFromSource } from '../controllers/episodeGenerationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getSources);
router.post('/', createSource);
router.delete('/:id', deleteSource);
router.post('/:id/generate-episode', generateEpisodeFromSource); // purane test routes replace kar diye

export default router;