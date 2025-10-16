'use server';
/**
 * @fileOverview A recipe generator AI flow.
 *
 * - recipeGeneratorFlow - A function that handles the recipe generation process.
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


// Define a recipe generator flow
const recipeGeneratorFlow = ai.defineFlow(
  {
    name: 'recipeGeneratorFlow',
    inputSchema: RecipeInputSchema,
    outputSchema: RecipeSchema,
  },
  async (input) => {
    // Create a prompt based on the input
    const prompt = `Create a recipe with the following requirements:
      Main ingredient: ${input.ingredient}
      Dietary restrictions: ${input.dietaryRestrictions || 'none'}`;

    // Generate structured recipe data using the same schema
    const { output } = await ai.generate({
      prompt,
      output: { schema: RecipeSchema },
    });

    if (!output) throw new Error('Failed to generate recipe');

    return output;
  },
);

export async function generateRecipe(input: RecipeInput): Promise<Recipe> {
    return recipeGeneratorFlow(input);
}
