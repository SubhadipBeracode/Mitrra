import axios from 'axios';
import * as cheerio from 'cheerio';

export const fetchArticleFromUrl = async (url) => {
  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    const $ = cheerio.load(response.data);

    // Open Graph tags — jyada websites (news, blogs, social previews) inhe set karti hain
    const ogTitle = $('meta[property="og:title"]').attr('content');
    const ogDescription = $('meta[property="og:description"]').attr('content');

    // Fallback: normal HTML tags
    const htmlTitle = $('title').text();
    const metaDescription = $('meta[name="description"]').attr('content');

    const title = ogTitle || htmlTitle || 'Untitled';
    const description = ogDescription || metaDescription || '';

    // Main body text nikalne ki koshish — common content containers try karo
    let bodyText = '';
    const contentSelectors = ['article', 'main', '[role="main"]', '.post-content', '.article-content', '.entry-content'];

    for (const selector of contentSelectors) {
      const el = $(selector).first();
      if (el.length && el.text().trim().length > 200) {
        bodyText = el.text().trim();
        break;
      }
    }

    // Agar kuch nahi mila, saare <p> tags combine karo
    if (!bodyText) {
      bodyText = $('p')
        .map((i, el) => $(el).text())
        .get()
        .join(' ')
        .trim();
    }

    // Clean up: extra whitespace hatao
    bodyText = bodyText.replace(/\s+/g, ' ').trim();

    if (!title && !description && !bodyText) {
      return { success: false, error: 'Could not extract any content from this URL' };
    }

    return {
      success: true,
      article: {
        title,
        url,
        snippet: description || bodyText.slice(0, 300),
        content: bodyText.slice(0, 3000), // limit rakhte hain taaki LLM prompt zyada bada na ho
        publishedAt: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error(`Failed to fetch content from ${url}:`, error.message);
    return { success: false, error: error.message };
  }
};