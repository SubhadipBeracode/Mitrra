import Parser from 'rss-parser';

const parser = new Parser({
  timeout: 8000, // 8 second timeout, taaki dead feed poore request ko atka na de
});

export const fetchArticlesFromRSS = async (feedUrl) => {
  try {
    const feed = await parser.parseURL(feedUrl);

    const articles = feed.items.slice(0, 10).map((item) => ({
      title: item.title || 'Untitled',
      url: item.link || '',
      publishedAt: item.pubDate || item.isoDate || null,
      snippet: item.contentSnippet || item.summary || '',
    }));

    return { success: true, articles };
  } catch (error) {
    console.error(`Failed to fetch RSS from ${feedUrl}:`, error.message);
    return { success: false, articles: [], error: error.message };
  }
};