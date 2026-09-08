import User from '../models/user.js';
import Source from '../models/Source.js';
import Episode from '../models/Episode.js';
import { fetchArticlesFromRSS } from '../ingestion/fetchSource.js';
import { rankArticles } from '../ranking/rankArticles.js';
import { generatePodcastScript } from '../generation/generateScript.js';
import { generateAudioFromScript } from '../tts/generateAudio.js';

const generateEpisodeForUser = async (user, baseUrl) => {
  try {
    const source = await Source.findOne({ user: user._id, type: 'RSS', url: { $ne: null } }).sort({ createdAt: 1 });

    if (!source) {
      console.log(`Skipping ${user.email} — no RSS source found`);
      return { skipped: true, reason: 'No RSS source' };
    }

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const existingEpisode = await Episode.findOne({
      user: user._id,
      createdAt: { $gte: startOfToday },
    });

    if (existingEpisode) {
      console.log(`Skipping ${user.email} — today's episode already exists`);
      return { skipped: true, reason: 'Already generated today' };
    }

    const fetchResult = await fetchArticlesFromRSS(source.url);
    if (!fetchResult.success || fetchResult.articles.length === 0) {
      console.log(`Skipping ${user.email} — RSS fetch failed or empty`);
      return { skipped: true, reason: 'RSS fetch failed' };
    }

    const rankedArticles = rankArticles(fetchResult.articles, source.name);
    const topArticles = rankedArticles.slice(0, 5);

    const scriptResult = await generatePodcastScript(topArticles);
    if (!scriptResult.success) {
      console.log(`Skipping ${user.email} — script generation failed`);
      return { skipped: true, reason: 'Script generation failed' };
    }

    const fileName = `episode_${user._id}_${Date.now()}.mp3`;
    const audioResult = await generateAudioFromScript(scriptResult.script, fileName);

    if (!audioResult.success) {
      console.log(`Skipping ${user.email} — audio generation failed`);
      return { skipped: true, reason: 'Audio generation failed' };
    }

    const audioUrl = `${baseUrl}/uploads/${fileName}`;

    const episode = await Episode.create({
      user: user._id,
      title: `Your ${source.name} Briefing`,
      audioUrl,
      transcript: scriptResult.script,
      duration: audioResult.duration || 0,
      feedback: null,
      sourceArticles: topArticles.map((a) => ({ title: a.title, url: a.url })),
    });

    console.log(`Episode generated for ${user.email}: ${episode._id}`);
    return { success: true, episodeId: episode._id };
  } catch (error) {
    console.error(`Error generating episode for ${user.email}:`, error.message);
    return { error: error.message };
  }
};

export const generateDailyEpisodesForAllUsers = async (baseUrl) => {
  console.log('--- Starting daily episode generation job ---');

  const users = await User.find({});
  console.log(`Found ${users.length} users`);

  const results = [];

  for (const user of users) {
    const result = await generateEpisodeForUser(user, baseUrl);
    results.push({ user: user.email, ...result });
  }

  console.log('--- Daily episode generation job finished ---');
  return results;
};