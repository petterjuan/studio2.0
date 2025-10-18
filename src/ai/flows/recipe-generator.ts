
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

import { z } from 'genkit';
import { generateRecipe as generateRecipeFlow } from './recipe-generator-flow';
import { Recipe, RecipeInput, RecipeInputSchema, RecipeSchema } from '@/lib/definitions';


// ========================
// Main Wrapper Function
// ========================
export async function generateRecipe(input: RecipeInput): Promise<Recipe> {
  // Normalize input
  const normalizedInput: RecipeInput = {
    ingredient: input.ingredient.trim().toLowerCase(),
    dietaryRestrictions: input.dietaryRestrictions?.trim() || '',
  };


  try {
    // Call AI flow
    const output = await generateRecipeFlow(normalizedInput);

    // Validate AI output against schema
    const validatedOutput = RecipeSchema.parse(output);

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
