
'use server';
/**
 * @fileOverview A flow to generate a new blog article and its audio summary.
 *
 * - generateAndSaveBlogArticle - A function that creates and saves a new article.
 * - BlogArticleSchema - The return type (the article).
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { firestore } from '@/firebase/server';
import { generateArticleAudio, AudioInput } from './audio-generator';

const BlogArticleSchema = z.object({
  handle: z.string().describe("A URL-friendly slug for the article title (e.g., 'el-poder-del-entrenamiento-de-fuerza')."),
  title: z.string().describe("A compelling, SEO-friendly title for the blog post."),
  contentHtml: z.string().describe("The full content of the article in HTML format. It should be well-structured with paragraphs, headings (h2, h3), and lists where appropriate. It should NOT include the main H1 title, as that is rendered separately."),
  excerpt: z.string().describe("A short, engaging summary of the article (1-2 sentences) for use in previews."),
  imageId: z.enum(['blog-macros', 'blog-strength', 'blog-recovery', 'blog-magnesium', 'hero-image', 'valentina-coach']).describe("An appropriate image ID from the available list to use as the article's featured image."),
});

export type BlogArticle = z.infer<typeof BlogArticleSchema>;

export async function generateAndSaveBlogArticle(): Promise<void> {
  console.log("Starting blog article generation flow...");
  const article = await blogGeneratorFlow();
  
  if (article) {
    console.log(`Article content generated for: "${article.title}". Now generating audio...`);
    // Now, generate the audio for the new article
    const audioInput: AudioInput = {
      articleTitle: article.title,
      articleExcerpt: article.excerpt,
    };
    const audioOutput = await generateArticleAudio(audioInput);
    
    // Validate the audio output before saving
    if (!audioOutput.media || !audioOutput.media.startsWith('data:audio/wav;base64,')) {
        console.error('Invalid audio data received from TTS flow. Aborting save.');
        throw new Error('Invalid audio data returned from TTS flow.');
    }
    
    const audioDataUri = audioOutput.media;

    const articlesCollection = firestore.collection('articles');
    await articlesCollection.add({
      ...article,
      publishedAt: new Date().toISOString(),
      audioDataUri: audioDataUri, // Save the audio data
    });
    console.log(`Successfully generated and saved article: "${article.title}" with audio.`);
  } else {
    console.error('Failed to generate blog article content. The flow returned no data.');
    throw new Error('Failed to generate blog article.');
  }
}

const blogPrompt = ai.definePrompt({
  name: 'blogGeneratorPrompt',
  model: 'gemini-1.5-flash',
  output: { schema: BlogArticleSchema },
  system: `Eres Valentina Montero, una reconocida coach de fitness y nutrición, experta en crear transformaciones físicas para mujeres. Tu tono es empoderador, conocedor y motivador.
  
  Tu tarea es escribir un nuevo artículo para tu blog. El artículo debe ser original, informativo y estar alineado con tu marca.

  **Instrucciones:**
  1.  **Elige un Tema Relevante:** Escoge un tema de interés para mujeres que buscan mejorar su salud y estado físico. Ejemplos de temas: nutrición, entrenamiento de fuerza, mentalidad, recuperación, mitos del fitness, etc.
  2.  **Crea un Título Atractivo:** El título debe ser llamativo y optimizado para SEO.
  3.  **Escribe Contenido de Calidad (sin el título principal):** El cuerpo del artículo debe estar en formato HTML. No incluyas el título principal (H1) en el HTML, ya que se renderiza por separado. El contenido debe ser bien estructurado, con párrafos claros, y usar etiquetas <h2> y <h3> para los subtítulos. Puede incluir listas (<ul> o <ol>) si es necesario. El contenido debe ser práctico y accionable.
  4.  **Genera un Resumen (Excerpt):** Escribe un resumen corto y atractivo (1-2 frases) que enganche al lector.
  5.  **Crea un Handle:** Genera un 'slug' para la URL que sea corto y descriptivo, basado en el título.
  6.  **Selecciona una Imagen:** Elige el 'imageId' más apropiado de la lista proporcionada que se relacione con el tema del artículo.

  Genera un artículo completamente nuevo y único que no hayas escrito antes.`,
  prompt: `Por favor, genera un nuevo artículo para el blog.`,
});

const blogGeneratorFlow = ai.defineFlow(
  {
    name: 'blogGeneratorFlow',
    outputSchema: BlogArticleSchema,
  },
  async () => {
    const { output } = await blogPrompt();
    
    // Explicitly validate the output against the schema before returning.
    // The .parse method will throw an error if the output doesn't match the schema.
    try {
        const validatedArticle = BlogArticleSchema.parse(output);
        return validatedArticle;
    } catch (error) {
        console.error("AI output failed validation:", error);
        throw new Error("Failed to generate a valid blog article from the AI model.");
    }
  }
);
