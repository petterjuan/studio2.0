
'use server';
/**
 * @fileOverview The core AI flow for generating recipes.
 * 
 * This file contains the Genkit prompt and flow definitions.
 */

import { ai } from '@/ai/genkit';
import { RecipeInputSchema, RecipeSchema } from '@/lib/definitions';
import { googleAI } from '@genkit-ai/google-genai';

// Define AI prompt
const recipePrompt = ai.definePrompt({
  name: 'recipePrompt',
  model: googleAI.model('gemini-1.5-pro'),
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
  async (input) => {
    const { output } = await recipePrompt(input);

    if (!output) {
      throw new Error(`AI returned no output for ingredient: "${input.ingredient}".`);
    }

    return output;
  },
);
