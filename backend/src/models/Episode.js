import mongoose from 'mongoose';

const episodeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic',
      default: null,
    },
    topicName: {
      type: String,
      default: null,
    },
    title: {
      type: String,
      required: true,
    },
    audioUrl: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      default: null,
    },
    transcript: {
      type: String,
      default: '',
    },
    duration: {
      type: Number,
      default: 0,
    },
    feedback: {
      type: String,
      enum: ['up', 'down', null],
      default: null,
    },
    sourceArticles: [
      {
        title: String,
        url: String,
      },
    ],
  },
  { timestamps: true }
);

const Episode = mongoose.model('Episode', episodeSchema);

export default Episode;