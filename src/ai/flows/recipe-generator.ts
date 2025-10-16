
'use server';
/**
 * @fileOverview A recipe generator AI flow.
 *
 * - generateRecipe - A function that handles the recipe generation process.
 * - RecipeInputSchema - The input type for the recipeGeneratorFlow function.
 * - RecipeSchema - The return type for the recipeGeneratorFlow function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Define input schema
export const RecipeInputSchema = z.object({
  ingredient: z.string().describe('Main ingredient or cuisine type'),
  dietaryRestrictions: z.string().optional().describe('Any dietary restrictions'),
});
export type RecipeInput = z.infer<typeof RecipeInputSchema>;


// Define output schema
export const RecipeSchema = z.object({
  title: z.string(),
  description: z.string(),
  prepTime: z.string(),
  cookTime: z.string(),
  servings: z.number(),
  ingredients: z.array(z.string()),
  instructions: z.array(z.string()),
  tips: z.array(z.string()).optional(),
});
export type Recipe = z.infer<typeof RecipeSchema>;


export async function generateRecipe(input: RecipeInput): Promise<Recipe> {
    return recipeGeneratorFlow(input);
}

const recipePrompt = ai.definePrompt({
    name: 'recipePrompt',
    model: 'gemini-1.5-flash-latest',
    input: { schema: RecipeInputSchema },
    output: { schema: RecipeSchema },
    prompt: `Create a recipe with the following requirements:
      Main ingredient: {{{ingredient}}}
      Dietary restrictions: {{{dietaryRestrictions}}}`,
});

// Define a recipe generator flow
const recipeGeneratorFlow = ai.defineFlow(
  {
    name: 'recipeGeneratorFlow',
    inputSchema: RecipeInputSchema,
    outputSchema: RecipeSchema,
  },
  async (input) => {
    const { output } = await recipePrompt(input);

    if (!output) throw new Error('Failed to generate recipe');

    return output;
  },
);
