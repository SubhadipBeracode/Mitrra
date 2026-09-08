import Source from '../models/Source.js';

export const getSources = async (req, res) => {
  try {
    const sources = await Source.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(sources);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch sources', error: error.message });
  }
};

export const createSource = async (req, res) => {
  try {
    const { name, type, url } = req.body;

    if (!name || !type) {
      return res.status(400).json({ message: 'Name and type are required' });
    }

    const source = await Source.create({
      user: req.user._id,
      name,
      type,
      url: url || null,
    });

    res.status(201).json(source);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create source', error: error.message });
  }
};

export const deleteSource = async (req, res) => {
  try {
    const source = await Source.findOne({ _id: req.params.id, user: req.user._id });

    if (!source) {
      return res.status(404).json({ message: 'Source not found' });
    }

    await source.deleteOne();

    res.status(200).json({ message: 'Source deleted', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete source', error: error.message });
  }
};