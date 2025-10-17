
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
  isValidIngredient: z.boolean().describe('Whether the provided ingredient is a real food item.'),
  error: z.string().optional().describe('A friendly error message if the ingredient is not valid.'),
  title: z.string().optional(),
  description: z.string().optional(),
  prepTime: z.string().optional(),
  cookTime: z.string().optional(),
  servings: z.number().optional(),
  ingredients: z.array(z.string()).optional(),
  instructions: z.array(z.string()).optional(),
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
    prompt: `You are an expert chef AI. First, validate if the user's main ingredient is a real, edible food item.
    
    If '{{{ingredient}}}' is NOT a valid food item (e.g., 'rocks', 'air', 'love'), set 'isValidIngredient' to false and provide a friendly 'error' message explaining why, like "Sorry, I can't create a recipe from [ingredient]. Please provide a real food item."
    
    If '{{{ingredient}}}' IS a valid food item, set 'isValidIngredient' to true and create a delicious, healthy recipe.
    - Main ingredient: {{{ingredient}}}
    - Dietary restrictions: {{{dietaryRestrictions}}}`,
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

    if (!output) {
      throw new Error('Failed to generate recipe: AI model did not return an output.');
    }

    return output;
  },
);
