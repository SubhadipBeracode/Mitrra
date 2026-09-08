/**
 * Articles ko rank karta hai recency + keyword relevance ke basis pe.
 * Har article ko ek score milta hai, phir sorted list return hoti hai.
 */

const calculateRecencyScore = (publishedAt) => {
  if (!publishedAt) return 0;

  const publishedDate = new Date(publishedAt);
  const now = new Date();
  const hoursAgo = (now - publishedDate) / (1000 * 60 * 60);

  // jitna zyada purana, utna kam score. 48 ghante se purane articles ka score bahut kam ho jata hai
  if (hoursAgo < 0) return 0; // future date, invalid
  if (hoursAgo <= 6) return 10;
  if (hoursAgo <= 24) return 7;
  if (hoursAgo <= 48) return 4;
  return 1;
};

const calculateKeywordScore = (article, sourceName) => {
  const keywords = sourceName
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 2); // chhote words (the, is, a) ignore karo

  const titleLower = (article.title || '').toLowerCase();
  const snippetLower = (article.snippet || '').toLowerCase();

  let score = 0;
  keywords.forEach((keyword) => {
    if (titleLower.includes(keyword)) score += 5;
    if (snippetLower.includes(keyword)) score += 2;
  });

  return score;
};

export const rankArticles = (articles, sourceName) => {
  const scored = articles.map((article) => {
    const recencyScore = calculateRecencyScore(article.publishedAt);
    const keywordScore = calculateKeywordScore(article, sourceName);

    return {
      ...article,
      _score: recencyScore + keywordScore,
    };
  });

  return scored.sort((a, b) => b._score - a._score);
};