import express from 'express';
import { generateDailyEpisodesForAllUsers } from '../jobs/generateDailyEpisodes.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/run-daily-job', protect, async (req, res) => {
  try {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const results = await generateDailyEpisodesForAllUsers(baseUrl);
    res.status(200).json({ message: 'Job completed', results });
  } catch (error) {
    res.status(500).json({ message: 'Job failed', error: error.message });
  }
});

export default router;