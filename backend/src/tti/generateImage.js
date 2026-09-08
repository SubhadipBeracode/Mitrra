import { fal } from '@fal-ai/client';
import fs from 'fs';
import path from 'path';

fal.config({
  credentials: process.env.FAL_KEY,
});

export const generateImageFromScript = async (
  scriptText,
  outputFileName
) => {
  try {
    if (!scriptText) {
      throw new Error('Script text is required');
    }

    const prompt = `
Create a high-quality image based on the following script.

SCRIPT:
${scriptText}

REQUIREMENTS:
- Visually represent the main scene from the script.
- Cinematic composition.
- Highly detailed.
- Natural lighting.
- Realistic and visually appealing.
- Clear subject and background.
- No text, subtitles, captions, logos, or watermarks.
`;

    const result = await fal.subscribe(
      'fal-ai/flux/dev',
      {
        input: {
          prompt,
          image_size: 'landscape_16_9',
          num_images: 1,
          output_format: 'png',
        },
      }
    );

    const imageUrl = result.data?.images?.[0]?.url;

    if (!imageUrl) {
      throw new Error('No image URL returned from fal.ai');
    }

    // Download generated image
    const imageResponse = await fetch(imageUrl);

    if (!imageResponse.ok) {
      throw new Error(
        `Failed to download generated image: ${imageResponse.status}`
      );
    }

    const imageBuffer = Buffer.from(
      await imageResponse.arrayBuffer()
    );

    // Create uploads directory
    const uploadsDir = path.join(
      process.cwd(),
      'uploads'
    );

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, {
        recursive: true,
      });
    }

    // Save image
    const filePath = path.join(
      uploadsDir,
      outputFileName
    );

    fs.writeFileSync(filePath, imageBuffer);

    return {
      success: true,
      filePath,
      fileName: outputFileName,
      imageUrl,
    };

  } catch (error) {
    console.error(
      'Image generation failed:',
      error.message
    );

    return {
      success: false,
      error: error.message,
    };
  }
};