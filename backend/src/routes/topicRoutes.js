import express from 'express';
import {
  getTopics,
  createTopic,
  deleteTopic,
  getTopicItems,
  addTopicItem,
  deleteTopicItem,
} from '../controllers/topicController.js';
import { generateEpisodeFromTopic, generateEpisodeFromItem } from '../controllers/episodeGenerationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getTopics);
router.post('/', createTopic);
router.delete('/:id', deleteTopic);

router.get('/:topicId/items', getTopicItems);
router.post('/:topicId/items', addTopicItem);
router.delete('/:topicId/items/:itemId', deleteTopicItem);

router.post('/:topicId/generate-episode', generateEpisodeFromTopic);
router.post('/:topicId/items/:itemId/generate-episode', generateEpisodeFromItem);

export default router;