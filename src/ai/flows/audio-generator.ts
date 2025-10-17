
'use server';
/**
 * @fileOverview A flow to generate an audio summary for a blog article.
 *
 * - generateArticleAudio - Creates a spoken-word summary.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import wav from 'wav';
import { googleAI } from '@genkit-ai/google-genai';

const AudioInputSchema = z.object({
  articleTitle: z.string().describe("The title of the article."),
  articleExcerpt: z.string().describe("The short summary/excerpt of the article."),
});

const AudioOutputSchema = z.object({
  media: z.string().describe("The base64 encoded WAV audio data URI."),
});

export type AudioInput = z.infer<typeof AudioInputSchema>;
export type AudioOutput = z.infer<typeof AudioOutputSchema>;

async function toWav(pcmData: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels: 1,
      sampleRate: 24000,
      bitDepth: 16,
    });
    const bufs: any[] = [];
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
  async ({ articleTitle, articleExcerpt }) => {
    const prompt = `Hola y bienvenida al blog de Valentina Montero. Aquí tienes un resumen de nuestro último artículo: ${articleTitle}.
    
    ${articleExcerpt}`;

    const { media } = await ai.generate({
      model: googleAI.model('gemini-1.5-flash-latest'),
      prompt: prompt,
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Algenib' }, // Friendly intro voice
            },
        },
      },
    });

    if (!media?.url) {
      throw new Error('No audio media was generated.');
    }

    const audioBuffer = Buffer.from(media.url.substring(media.url.indexOf(',') + 1), 'base64');
    const wavBase64 = await toWav(audioBuffer);

    return { media: `data:audio/wav;base64,${wavBase64}` };
  }
);
