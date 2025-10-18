
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
import { RecipeInputSchema, RecipeSchema, RecipeInput, Recipe } from './recipe-generator';

/**
 * Normalizes user input
 */
function normalizeInput(input: RecipeInput): RecipeInput {
  return {
    ingredient: input.ingredient.trim().toLowerCase(),
    dietaryRestrictions: input.dietaryRestrictions?.trim() || 'none',
  };
}

// Define AI prompt
const recipePrompt = ai.definePrompt({
  name: 'recipePrompt',
  model: 'gemini-1.5-flash-latest',
  input: { schema: RecipeInputSchema },
  output: { schema: RecipeSchema },
  prompt: `
You are an expert chef AI. 

Step 1: Validate if the user's main ingredient '{{{ingredient}}}' is a real, edible food item.
- If NOT valid (e.g., 'rocks', 'air', 'love'), set 'isValidIngredient' to false and provide a friendly 'error' message like "Sorry, I can't create a recipe from [ingredient]. Please provide a real food item."

Step 2: If valid, create a healthy, well-structured recipe.
Requirements:
- Main ingredient: {{{ingredient}}}
- Dietary restrictions: {{{dietaryRestrictions}}}
- Title max 60 chars
- Description max 200 chars
- PrepTime and CookTime in "XX mins" format
- Ingredients: min 3 items
- Instructions: min 3 steps
- Tips: optional, max 3 tips
Respond strictly according to the schema in JSON format.
`,
});

// AI flow
export const generateRecipe = ai.defineFlow(
  {
    name: 'recipeGeneratorFlow',
    inputSchema: RecipeInputSchema,
    outputSchema: RecipeSchema,
  },
  async (rawInput) => {
    const input = normalizeInput(rawInput);
    console.log('[RecipeGenerator] Input:', input);

    try {
      const { output } = await recipePrompt(input);

      if (!output) {
        console.warn('[RecipeGenerator] AI returned no output. Using fallback.');
        return {
          isValidIngredient: false,
          error: `Sorry, I couldn't generate a recipe for "${input.ingredient}".`,
        };
      }

      // Validate AI output against schema
      const validatedOutput = RecipeSchema.parse(output);
      console.log('[RecipeGenerator] Validated output:', validatedOutput);

      return validatedOutput;
    } catch (err) {
      console.error('[RecipeGenerator] Error generating recipe:', err);
      return {
        isValidIngredient: false,
        error: `Sorry, something went wrong generating a recipe for "${input.ingredient}". Please try again.`,
      };
    }
  },
);
