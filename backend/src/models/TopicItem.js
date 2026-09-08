import mongoose from 'mongoose';

const topicItemSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic',
      required: true,
    },
    type: {
      type: String,
      enum: ['RSS', 'Link'],
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    platform: {
      type: String,
      enum: ['Instagram', 'YouTube', 'LinkedIn', 'X', 'Facebook', 'Website', 'Other'],
      default: 'Website',
    },
    name: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { timestamps: true }
);

const TopicItem = mongoose.model('TopicItem', topicItemSchema);

export default TopicItem;