import Topic from '../models/Topic.js';
import TopicItem from '../models/TopicItem.js';

export const getTopics = async (req, res) => {
  try {
    const topics = await Topic.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(topics);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch topics', error: error.message });
  }
};

export const createTopic = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Topic name is required' });
    }

    const topic = await Topic.create({ user: req.user._id, name });
    res.status(201).json(topic);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create topic', error: error.message });
  }
};

export const deleteTopic = async (req, res) => {
  try {
    const topic = await Topic.findOne({ _id: req.params.id, user: req.user._id });

    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    await TopicItem.deleteMany({ topic: topic._id, user: req.user._id });
    await topic.deleteOne();

    res.status(200).json({ message: 'Topic deleted', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete topic', error: error.message });
  }
};

export const getTopicItems = async (req, res) => {
  try {
    const items = await TopicItem.find({ topic: req.params.topicId, user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch topic items', error: error.message });
  }
};

export const addTopicItem = async (req, res) => {
  try {
    const { type, url, platform, name } = req.body;

    if (!type || !url) {
      return res.status(400).json({ message: 'Type and URL are required' });
    }

    const topic = await Topic.findOne({ _id: req.params.topicId, user: req.user._id });
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    const item = await TopicItem.create({
      user: req.user._id,
      topic: topic._id,
      type,
      url,
      platform: platform || 'Website',
      name: name || '',
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add item', error: error.message });
  }
};

export const deleteTopicItem = async (req, res) => {
  try {
    const item = await TopicItem.findOne({ _id: req.params.itemId, user: req.user._id });

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    await item.deleteOne();

    res.status(200).json({ message: 'Item deleted', id: req.params.itemId });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete item', error: error.message });
  }
};