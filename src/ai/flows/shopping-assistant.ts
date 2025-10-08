'use server';
/**
 * @fileOverview AI shopping assistant flow that helps users find fitness and nutrition products.
 *
 * - shoppingAssistant - A function that handles the shopping assistant conversation.
 * - ShoppingAssistantInput - The input type for the shoppingAssistant function.
 * - ShoppingAssistantOutput - The return type for the shoppingAssistant function.
 */

import {ai} from '@/ai/genkit';
import { getProductByHandle } from '@/lib/products';
import {z} from 'genkit';

const ShoppingAssistantInputSchema = z.object({
  query: z.string().describe('La consulta del usuario sobre productos de fitness y nutrición.'),
  history: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string(),
    })
  ).optional().describe('El historial de la conversación.'),
});
export type ShoppingAssistantInput = z.infer<typeof ShoppingAssistantInputSchema>;

const ShoppingAssistantOutputSchema = z.object({
  response: z.string().describe('La respuesta del asistente de compras de IA.'),
});
export type ShoppingAssistantOutput = z.infer<typeof ShoppingAssistantOutputSchema>;

export async function shoppingAssistant(input: ShoppingAssistantInput): Promise<ShoppingAssistantOutput> {
  return shoppingAssistantFlow(input);
}

const productInfoTool = ai.defineTool({
  name: 'getProductInfo',
  description: 'Recupera información sobre un producto dado su handle.',
  inputSchema: z.object({
    handle: z.string().describe('El handle del producto para recuperar información.'),
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
      title: 'Producto no encontrado.',
      description: 'Producto no encontrado.',
      price: 'Producto no encontrado.',
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
  prompt: `Eres un asistente de compras para una tienda de fitness y nutrición.

  Tu trabajo es ayudar a los usuarios a encontrar los productos que necesitan.
  Tienes acceso a una herramienta llamada "getProductInfo" que te permite obtener información sobre un producto dado su handle.

  Usa esta herramienta para responder preguntas sobre productos.

  Este es el historial de la conversación:
  {{#each history}}
  {{#if (this.role == 'user')}}Usuario: {{this.content}}{{/if}}
  {{#if (this.role == 'assistant')}}Asistente: {{this.content}}{{/if}}
  {{/each}}

  Usuario: {{{query}}}
  Asistente: `,
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
