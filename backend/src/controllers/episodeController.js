import Episode from '../models/Episode.js';

export const getEpisodes = async (req, res) => {
  try {
    const episodes = await Episode.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(episodes);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch episodes', error: error.message });
  }
};

export const getEpisodeById = async (req, res) => {
  try {
    const episode = await Episode.findOne({ _id: req.params.id, user: req.user._id });

    if (!episode) {
      return res.status(404).json({ message: 'Episode not found' });
    }

    res.status(200).json(episode);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch episode', error: error.message });
  }
};

export const updateFeedback = async (req, res) => {
  try {
    const { feedback } = req.body;

    if (!['up', 'down', null].includes(feedback)) {
      return res.status(400).json({ message: 'Invalid feedback value' });
    }

    const episode = await Episode.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { feedback },
      { new: true }
    );

    if (!episode) {
      return res.status(404).json({ message: 'Episode not found' });
    }

    res.status(200).json(episode);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update feedback', error: error.message });
  }
};

export const deleteEpisode = async (req, res) => {
  try {
    const episode = await Episode.findOne({ _id: req.params.id, user: req.user._id });

    if (!episode) {
      return res.status(404).json({ message: 'Episode not found' });
    }

    await episode.deleteOne();

    res.status(200).json({ message: 'Episode deleted', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete episode', error: error.message });
  }
};