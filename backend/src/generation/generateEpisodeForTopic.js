import Topic from '../models/Topic.js';
import TopicItem from '../models/TopicItem.js';
import Episode from '../models/Episode.js';
import { fetchArticlesFromRSS } from '../ingestion/fetchSource.js';
import { fetchArticleFromUrl } from '../ingestion/fetchFromUrl.js';
import { rankArticles } from '../ranking/rankArticles.js';
import { generatePodcastScript } from '../generation/generateScript.js';
import { generateAudioFromScript } from '../tts/generateAudio.js';
import { generateEpisodeImage } from './generateImage.js';

const buildEpisodeFromArticles = async (articles, userId, topicId, topicName, rankingLabel, baseUrl) => {
  if (articles.length === 0) {
    return { success: false, error: 'Could not fetch any content from this source', status: 502 };
  }

  const rankedArticles = rankArticles(articles, rankingLabel);
  const topArticles = rankedArticles.slice(0, 6);

  const scriptResult = await generatePodcastScript(topArticles);
  if (!scriptResult.success) {
    return { success: false, error: scriptResult.error, status: 502 };
  }

  const fileName = `episode_${userId}_${Date.now()}.mp3`;
  const audioResult = await generateAudioFromScript(scriptResult.script, fileName);

  if (!audioResult.success) {
    return { success: false, error: audioResult.error, status: 502 };
  }

  const audioUrl = `${process.env.SERVER_BASE_URL || baseUrl}/uploads/${fileName}`;

  // Image generation — agar fail bhi ho jaye, episode phir bhi bane (image optional hai)
  let imageUrl = null;
  const imageFileName = `image_${userId}_${Date.now()}.png`;
  const imageResult = await generateEpisodeImage(scriptResult.script, imageFileName);
  if (imageResult.success) {
    imageUrl = `${process.env.SERVER_BASE_URL || baseUrl}/uploads/images/${imageFileName}`;
  }

  const episode = await Episode.create({
    user: userId,
    topic: topicId,
    topicName,
    title: `Your ${rankingLabel} Briefing`,
    audioUrl,
    imageUrl,
    transcript: scriptResult.script,
    duration: audioResult.duration || 0,
    feedback: null,
    sourceArticles: topArticles.map((a) => ({ title: a.title, url: a.url })),
  });

  return { success: true, episode };
};

export const generateEpisodeForTopic = async (topicId, userId, baseUrl) => {
  const topic = await Topic.findOne({ _id: topicId, user: userId });
  if (!topic) {
    return { success: false, error: 'Topic not found', status: 404 };
  }

  const items = await TopicItem.find({ topic: topicId, user: userId });
  if (items.length === 0) {
    return { success: false, error: 'This topic has no sources yet. Add an RSS feed or link first.', status: 422 };
  }

  let allArticles = [];

  for (const item of items) {
    if (item.type === 'RSS') {
      const result = await fetchArticlesFromRSS(item.url);
      if (result.success) allArticles.push(...result.articles);
    } else if (item.type === 'Link') {
      const result = await fetchArticleFromUrl(item.url);
      if (result.success) allArticles.push(result.article);
    }
  }

  return buildEpisodeFromArticles(allArticles, userId, topic._id, topic.name, topic.name, baseUrl);
};

export const generateEpisodeForSingleItem = async (topicId, itemId, userId, baseUrl) => {
  const topic = await Topic.findOne({ _id: topicId, user: userId });
  if (!topic) {
    return { success: false, error: 'Topic not found', status: 404 };
  }

  const item = await TopicItem.findOne({ _id: itemId, topic: topicId, user: userId });
  if (!item) {
    return { success: false, error: 'Source not found', status: 404 };
  }

  let articles = [];

  if (item.type === 'RSS') {
    const result = await fetchArticlesFromRSS(item.url);
    if (result.success) articles = result.articles;
  } else if (item.type === 'Link') {
    const result = await fetchArticleFromUrl(item.url);
    if (result.success) articles = [result.article];
  }

  const label = item.name || item.platform || topic.name;

  return buildEpisodeFromArticles(articles, userId, topic._id, topic.name, label, baseUrl);
};