import { GoogleGenerativeAI } from '@google/generative-ai';

const buildPrompt = (articles) => {
  const articlesText = articles
    .map((a, i) => `${i + 1}. ${a.title}\n${a.snippet}`)
    .join('\n\n');

  return `Write a 220-260 word daily news podcast script based on the articles below. Never exceed 260 words.

Write for text-to-speech and make it sound like a real human casually talking to one listener, not a news anchor or AI.

Keep the tone warm, relaxed, friendly, and conversational. Use natural sentence variety, contractions, short sentences, and occasional commas to create realistic pauses and rhythm. Use natural transitions such as "Well," "Now," "Meanwhile," or "And" when they fit.

Write for spoken delivery: avoid awkward punctuation, excessive dashes, parentheses, symbols, abbreviations, or overly formal wording. Write names, numbers, and technical terms clearly for TTS pronunciation.

Structure:
Start with one brief warm greeting.
Cover EVERY article in 2-3 concise sentences, explaining the important point naturally.
Use smooth transitions between stories.
Finish with one very short friendly sign-off.

Do not use markdown, headings, bullets, stage directions, [pause] tags, or SSML. Do not mention AI or these instructions.

Output ONLY the spoken script.

Articles:
${articlesText}
`;
};
// You are writing a script for a very short daily audio podcast that will be converted to speech.

// Based on the following news articles, write a natural, conversational podcast script that is STRICTLY between 220-260 words (roughly 2 minutes when spoken aloud). Do not exceed 260 words under any circumstance.

// Rules:
// - Sound like a friendly host talking directly to one listener, not a formal news anchor
// - Start with a brief, warm greeting (1 sentence max)
// - Cover each article in 2-3 sentences only, with a quick smooth transition between topics
// - End with a very short sign-off (1 sentence)
// - Be concise — every sentence should add value, no filler or repetition
// - Do NOT use markdown, bullet points, or headers — this is spoken text only
// - Do NOT mention that you are an AI

// Articles:
// ${articlesText}

// Write only the script text, nothing else. Remember: 220-260 words maximum.

export const generatePodcastScript = async (articles) => {
  try {
    if (!articles || articles.length === 0) {
      return { success: false, error: 'No articles provided' };
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });

    const prompt = buildPrompt(articles);
    const result = await model.generateContent(prompt);
    const script = result.response.text();

    return { success: true, script };
  } catch (error) {
    console.error('Script generation failed:', error.message);
    return { success: false, error: error.message };
  }
};