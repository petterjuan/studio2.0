
'use server';
/**
 * @fileOverview Robust AI wrapper for recipe generation.
 * 
 * Features:
 * - Input normalization
 * - Ingredient validation
 * - AI output schema validation
 * - Configurable logging for debugging
 * - Safe fallback on AI failure
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { generateRecipe as generateRecipeFlow } from './recipe-generator-flow';

// ========================
// Input & Output Schemas
// ========================
export const RecipeInputSchema = z.object({
  ingredient: z.string().min(1).describe('Main ingredient or cuisine type'),
  dietaryRestrictions: z.string().optional().describe('Any dietary restrictions'),
});
export type RecipeInput = z.infer<typeof RecipeInputSchema>;

export const RecipeSchema = z.object({
  isValidIngredient: z.boolean().describe('Whether the provided ingredient is a real, edible food item.'),
  error: z.string().optional().describe('Friendly error message if the ingredient is invalid.'),
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

// ========================
// Configuration
// ========================
const DEBUG = process.env.NODE_ENV !== 'production';

// ========================
// Main Wrapper Function
// ========================
export async function generateRecipe(input: RecipeInput): Promise<Recipe> {
  // Normalize input
  const normalizedInput: RecipeInput = {
    ingredient: input.ingredient.trim().toLowerCase(),
    dietaryRestrictions: input.dietaryRestrictions?.trim() || '',
  };

  if (DEBUG) console.log('[RecipeWrapper] Normalized Input:', normalizedInput);

  try {
    // Call AI flow
    const output = await generateRecipeFlow(normalizedInput);

    // Validate AI output against schema
    const validatedOutput = RecipeSchema.parse(output);

    if (DEBUG) console.log('[RecipeWrapper] Validated Output:', validatedOutput);

    return validatedOutput;

  } catch (err) {
    console.error('[RecipeWrapper] Error generating recipe:', err);

    // Safe fallback response
    return {
      isValidIngredient: false,
      error: `Sorry, couldn't generate a recipe for "${normalizedInput.ingredient}". Please try another ingredient.`,
    };
  }
}
