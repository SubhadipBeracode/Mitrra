import axios from 'axios';
import fs from 'fs';
import path from 'path';
import getMP3Duration from 'get-mp3-duration';

export const generateAudioFromScript = async (scriptText, outputFileName) => {
  try {
    const apiKey = process.env.VOICERSS_API_KEY;

    const response = await axios.post(
      'https://api.voicerss.org/',
      new URLSearchParams({
        key: apiKey,
        src: scriptText,
        hl: 'en-us',
        v: 'John',
        c: 'MP3',
        f: '44khz_16bit_stereo',
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        responseType: 'arraybuffer',
      }
    );

    const contentType = response.headers['content-type'];
    if (contentType && contentType.includes('text')) {
      const errorText = Buffer.from(response.data).toString('utf-8');
      throw new Error(errorText);
    }

    const audioBuffer = Buffer.from(response.data);

    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, outputFileName);
    fs.writeFileSync(filePath, audioBuffer);

    const durationMs = getMP3Duration(audioBuffer);
    const durationSeconds = Math.round(durationMs / 1000);

    return { success: true, filePath, fileName: outputFileName, duration: durationSeconds };
  } catch (error) {
    console.error('TTS generation failed:', error.message);
    return { success: false, error: error.message };
  }
};