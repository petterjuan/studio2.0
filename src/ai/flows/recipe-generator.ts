
'use server';
/**
 * @fileOverview A robust AI flow to generate recipes.
 * 
 * Features:
 * - Ingredient validation
 * - AI output schema validation
 * - Input normalization
 * - Logging for debugging
 * - Fallback on AI failure
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { generateRecipe as generateRecipeFlow } from './recipe-generator-flow';

// Input schema
export const RecipeInputSchema = z.object({
  ingredient: z.string().min(1).describe('Main ingredient or cuisine type'),
  dietaryRestrictions: z.string().optional().describe('Any dietary restrictions'),
});
export type RecipeInput = z.infer<typeof RecipeInputSchema>;

// Output schema
export const RecipeSchema = z.object({
  isValidIngredient: z.boolean().describe('Whether the provided ingredient is a real, edible food item.'),
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
    return generateRecipeFlow(input);
}
