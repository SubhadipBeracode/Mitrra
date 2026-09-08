import { generateEpisodeForTopic, generateEpisodeForSingleItem } from '../generation/generateEpisodeForTopic.js';

export const generateEpisodeFromTopic = async (req, res) => {
  try {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const result = await generateEpisodeForTopic(req.params.topicId, req.user._id, baseUrl);

    if (!result.success) {
      return res.status(result.status || 500).json({ message: result.error });
    }

    res.status(201).json(result.episode);
  } catch (error) {
    res.status(500).json({ message: 'Episode generation failed', error: error.message });
  }
};

export const generateEpisodeFromItem = async (req, res) => {
  try {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const result = await generateEpisodeForSingleItem(
      req.params.topicId,
      req.params.itemId,
      req.user._id,
      baseUrl
    );

    if (!result.success) {
      return res.status(result.status || 500).json({ message: result.error });
    }

    res.status(201).json(result.episode);
  } catch (error) {
    res.status(500).json({ message: 'Episode generation failed', error: error.message });
  }
};