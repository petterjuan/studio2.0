'use server';
/**
 * @fileOverview AI shopping assistant flow that helps users find fitness and nutrition products.
 *
 * - shoppingAssistant - A function that handles the shopping assistant conversation.
 * - ShoppingAssistantInput - The input type for the shoppingAssistant function.
 * - ShoppingAssistantOutput - The return type for the shoppingAssistant function.
 */

import {ai} from '@/ai/genkit';
import {getProductByHandle} from '@/lib/shopify';
import {z} from 'genkit';

const ShoppingAssistantInputSchema = z.object({
  query: z.string().describe('The user query about fitness and nutrition products.'),
  history: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string(),
    })
  ).optional().describe('The history of the conversation.'),
});
export type ShoppingAssistantInput = z.infer<typeof ShoppingAssistantInputSchema>;

const ShoppingAssistantOutputSchema = z.object({
  response: z.string().describe('The response from the AI shopping assistant.'),
});
export type ShoppingAssistantOutput = z.infer<typeof ShoppingAssistantOutputSchema>;

export async function shoppingAssistant(input: ShoppingAssistantInput): Promise<ShoppingAssistantOutput> {
  return shoppingAssistantFlow(input);
}

const productInfoTool = ai.defineTool({
  name: 'getProductInfo',
  description: 'Retrieves information about a product given its handle.',
  inputSchema: z.object({
    handle: z.string().describe('The handle of the product to retrieve information about.'),
  }),
  outputSchema: z.object({
    title: z.string(),
    description: z.string(),
    price: z.string(),
  }),
}, async (input) => {
  const product = await getProductByHandle(input.handle);
  if (!product) {
    return {
      title: 'Product not found.',
      description: 'Product not found.',
      price: 'Product not found.',
    };
  }
  return {
    title: product.title,
    description: product.description,
    price: product.price,
  };
});

const shoppingAssistantPrompt = ai.definePrompt({
  name: 'shoppingAssistantPrompt',
  tools: [productInfoTool],
  input: {schema: ShoppingAssistantInputSchema},
  output: {schema: ShoppingAssistantOutputSchema},
  prompt: `You are a shopping assistant for a fitness and nutrition store.

  Your job is to help users find the products they need.
  You have access to a tool called \"getProductInfo\" that allows you to get information about a product given its handle.

  Use this tool to answer questions about products.

  Here's the conversation history:
  {{#each history}}
  {{#if (eq role \"user\")}}User: {{content}}{{/if}}
  {{#if (eq role \"assistant\")}}Assistant: {{content}}{{/if}}
  {{/each}}

  User: {{{query}}}
  Assistant: `,
});

const shoppingAssistantFlow = ai.defineFlow(
  {
    name: 'shoppingAssistantFlow',
    inputSchema: ShoppingAssistantInputSchema,
    outputSchema: ShoppingAssistantOutputSchema,
  },
  async input => {
    const {output} = await shoppingAssistantPrompt(input);
    return output!;
  }
);

