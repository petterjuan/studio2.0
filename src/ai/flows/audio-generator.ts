
'use server';
/**
 * @fileOverview A robust AI flow to generate audio summaries for blog articles.
 * 
 * Features:
 * - Safe length handling
 * - Media URI validation
 * - Base64 WAV conversion
 * - Configurable voice
 * - Logging for debugging
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import wav from 'wav';
import { googleAI } from '@genkit-ai/google-genai';

const AudioInputSchema = z.object({
  articleTitle: z.string().max(150).describe("The title of the article."),
  articleExcerpt: z.string().max(500).describe("The short summary/excerpt of the article."),
  voiceName: z.string().optional().describe("Optional: voice to use for TTS."),
});

const AudioOutputSchema = z.object({
  media: z.string().describe("The base64 encoded WAV audio data URI."),
});

export type AudioInput = z.infer<typeof AudioInputSchema>;
export type AudioOutput = z.infer<typeof AudioOutputSchema>;

// Convert PCM Buffer to WAV Base64
async function toWav(pcmData: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels: 1,
      sampleRate: 24000,
      bitDepth: 16,
    });

    const bufs: Buffer[] = [];
    writer.on('data', (chunk) => bufs.push(chunk));
    writer.on('end', () => resolve(Buffer.concat(bufs).toString('base64')));
    writer.on('error', reject);

    writer.write(pcmData);
    writer.end();
  });
}

export async function generateArticleAudio(input: AudioInput): Promise<AudioOutput> {
  return articleAudioFlow(input);
}

const articleAudioFlow = ai.defineFlow(
  {
    name: 'articleAudioFlow',
    inputSchema: AudioInputSchema,
    outputSchema: AudioOutputSchema,
  },
  async ({ articleTitle, articleExcerpt, voiceName = 'Algenib' }) => {
    // Sanitize lengths
    const safeTitle = articleTitle.slice(0, 150);
    const safeExcerpt = articleExcerpt.slice(0, 500);

    console.log(`Generating audio for article: "${safeTitle}" (${safeExcerpt.length} chars)`);

    // Construct prompt
    const prompt = `
Genera un resumen hablado de este artículo para el blog de Valentina Montero.
El tono debe ser amigable, claro y profesional, listo para reproducción en audio.
Título: ${safeTitle}
Resumen: ${safeExcerpt}
`;

    // Call AI TTS generation
    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      prompt,
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName }, 
          },
        },
      },
    });

    if (!media?.url?.startsWith('data:audio')) {
      throw new Error('Generated media is not a valid data URI.');
    }

    // Convert audio to WAV Base64
    const audioBuffer = Buffer.from(media.url.split(',')[1], 'base64');
    const wavBase64 = await toWav(audioBuffer);
    const fullWavDataUri = `data:audio/wav;base64,${wavBase64}`;
    
    // Extra validation
    if (!/^data:audio\/wav;base64,[A-Za-z0-9+/=]+$/.test(fullWavDataUri)) {
      throw new Error('Invalid WAV base64 data.');
    }

    return { media: fullWavDataUri };
  }
);
