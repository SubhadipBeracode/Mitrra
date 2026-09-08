import Source from '../models/Source.js';
import { fetchArticlesFromRSS } from '../ingestion/fetchSource.js';
import { rankArticles } from '../ranking/rankArticles.js';

export const testFetchSource = async (req, res) => {
  try {
    const source = await Source.findOne({ _id: req.params.id, user: req.user._id });

    if (!source) {
      return res.status(404).json({ message: 'Source not found' });
    }

    if (source.type !== 'RSS' || !source.url) {
      return res.status(400).json({ message: 'This source is not an RSS feed with a URL' });
    }

    const result = await fetchArticlesFromRSS(source.url);

    if (!result.success) {
      return res.status(502).json({ message: 'Failed to fetch RSS feed', error: result.error });
    }

    const rankedArticles = rankArticles(result.articles, source.name);
    const topArticles = rankedArticles.slice(0, 5); // top 5 hi rakhte hain

    res.status(200).json({
      source: source.name,
      articleCount: topArticles.length,
      articles: topArticles,
    });
  } catch (error) {
    res.status(500).json({ message: 'Ingestion test failed', error: error.message });
  }
};