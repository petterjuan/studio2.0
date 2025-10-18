
'use server';
/**
 * @fileOverview An AI flow to review user-generated workout plans.
 * 
 * - reviewWorkoutPlan - A function that analyzes a plan and provides a recommendation.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ReviewInputSchema = z.object({
  userObjective: z.string().max(100).describe("El objetivo del usuario (ej. 'perder grasa', 'ganar músculo')."),
  userExperience: z.string().max(50).describe("La experiencia del usuario (ej. 'principiante', 'avanzado')."),
  planTitle: z.string().max(150).describe("El título del plan de entrenamiento."),
  planSummary: z.string().max(1000).describe("El resumen del plan de entrenamiento."),
});

const ReviewOutputSchema = z.object({
  recommendation: z.enum(['Approve', 'Deny']).describe("Tu recomendación final: 'Approve' (Aprobar) o 'Deny' (Denegar)."),
  reason: z.string().describe("Una justificación concisa (1-2 frases) para tu recomendación, explicando si el plan es seguro, efectivo y está alineado con los objetivos del usuario."),
});

export type ReviewInput = z.infer<typeof ReviewInputSchema>;
export type ReviewOutput = z.infer<typeof ReviewOutputSchema>;

const reviewPrompt = ai.definePrompt({
  name: 'adminReviewPrompt',
  model: 'gemini-1.5-flash-latest',
  input: { schema: ReviewInputSchema },
  output: { schema: ReviewOutputSchema },
  prompt: `Eres un asistente de IA para Valentina Montero, una coach de fitness experta. Tu tarea es revisar un plan de entrenamiento generado por un usuario y dar una recomendación de 'Aprobar' o 'Denegar' con una breve justificación.

  **Criterios para Aprobar:**
  - El plan parece seguro y bien estructurado.
  - El título y el resumen son coherentes y se alinean con el objetivo y la experiencia del usuario.
  - No hay nada peligrosamente incorrecto o sin sentido en el plan.

  **Criterios para Denegar:**
  - El plan parece inseguro, desequilibrado o inapropiado para el nivel de experiencia del usuario.
  - El contenido del plan no coincide en absoluto con el objetivo del usuario.
  - El plan es vago o carece de detalles suficientes para ser útil.

  **Datos del Plan a Revisar:**
  - **Objetivo del Usuario:** {{{userObjective}}}
  - **Experiencia del Usuario:** {{{userExperience}}}
  - **Título del Plan:** {{{planTitle}}}
  - **Resumen del Plan:** {{{planSummary}}}

  Basado en estos datos, proporciona tu recomendación y justificación. Responde únicamente en formato JSON.`,
});

export const reviewWorkoutPlan = ai.defineFlow(
  {
    name: 'adminReviewFlow',
    inputSchema: ReviewInputSchema,
    outputSchema: ReviewOutputSchema,
  },
  async (input) => {
    const { output } = await reviewPrompt(input);
    
    if (!output) {
      throw new Error("La revisión de la IA falló: el resultado es nulo.");
    }

    // Optional but recommended: server-side validation
    ReviewOutputSchema.parse(output);

    return output;
  }
);
