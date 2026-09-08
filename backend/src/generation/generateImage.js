import { InferenceClient } from '@huggingface/inference';
import fs from 'fs';
import path from 'path';

const buildImagePrompt = (transcript) => {
  const excerpt = transcript.slice(0, 400);

  return `A beautiful, abstract podcast cover art representing this topic: "${excerpt}". Modern minimalist design, vibrant gradient colors, no text, no words, no letters, artistic and premium aesthetic, suitable for a podcast app album cover.`;
};

export const generateEpisodeImage = async (transcript, outputFileName) => {
  try {
    const client = new InferenceClient(process.env.HUGGINGFACE_API_KEY);

    const prompt = buildImagePrompt(transcript);

    const imageBlob = await client.textToImage({
      model: 'stabilityai/stable-diffusion-xl-base-1.0',
      inputs: prompt,
    });

    const arrayBuffer = await imageBlob.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);

    const uploadsDir = path.join(process.cwd(), 'uploads', 'images');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, outputFileName);
    fs.writeFileSync(filePath, imageBuffer);

    return { success: true, fileName: outputFileName };
  } catch (error) {
    console.error('Image generation failed:', error.message);
    return { success: false, error: error.message };
  }
};