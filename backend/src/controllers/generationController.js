import Source from '../models/Source.js';
import { fetchArticlesFromRSS } from '../ingestion/fetchSource.js';
import { rankArticles } from '../ranking/rankArticles.js';
import { generatePodcastScript } from '../generation/generateScript.js';
import { generateAudioFromScript } from '../tts/generateAudio.js';

export const testGenerateScript = async (req, res) => {
  try {
    const source = await Source.findOne({ _id: req.params.id, user: req.user._id });
    if (!source) {
      return res.status(404).json({ message: 'Source not found' });
    }

    if (source.type !== 'RSS' || !source.url) {
      return res.status(400).json({ message: 'This source is not an RSS feed with a URL' });
    }

    const fetchResult = await fetchArticlesFromRSS(source.url);
    if (!fetchResult.success) {
      return res.status(502).json({ message: 'Failed to fetch RSS feed', error: fetchResult.error });
    }

    const rankedArticles = rankArticles(fetchResult.articles, source.name);
    const topArticles = rankedArticles.slice(0, 5);

    const scriptResult = await generatePodcastScript(topArticles);
    if (!scriptResult.success) {
      return res.status(502).json({ message: 'Failed to generate script', error: scriptResult.error });
    }

    res.status(200).json({
      source: source.name,
      articlesUsed: topArticles.length,
      script: scriptResult.script,
    });
  } catch (error) {
    res.status(500).json({ message: 'Script generation test failed', error: error.message });
  }
};

export const testGenerateAudio = async (req, res) => {
  try {
    const source = await Source.findOne({ _id: req.params.id, user: req.user._id });
    if (!source) {
      return res.status(404).json({ message: 'Source not found' });
    }

    const fetchResult = await fetchArticlesFromRSS(source.url);
    if (!fetchResult.success) {
      return res.status(502).json({ message: 'Failed to fetch RSS feed', error: fetchResult.error });
    }

    const rankedArticles = rankArticles(fetchResult.articles, source.name);
    const topArticles = rankedArticles.slice(0, 5);

    const scriptResult = await generatePodcastScript(topArticles);
    if (!scriptResult.success) {
      return res.status(502).json({ message: 'Failed to generate script', error: scriptResult.error });
    }

    const fileName = `episode_${Date.now()}.mp3`;
    const audioResult = await generateAudioFromScript(scriptResult.script, fileName);

    if (!audioResult.success) {
      return res.status(502).json({ message: 'Failed to generate audio', error: audioResult.error });
    }

    const audioUrl = `${req.protocol}://${req.get('host')}/uploads/${fileName}`;

    res.status(200).json({
      source: source.name,
      script: scriptResult.script,
      audioUrl,
    });
  } catch (error) {
    res.status(500).json({ message: 'Full pipeline test failed', error: error.message });
  }
};