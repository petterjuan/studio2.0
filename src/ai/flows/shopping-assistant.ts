
'use server';
/**
 * @fileOverview Optimized shopping assistant flow for VM Fitness Hub.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getProducts } from '@/lib/products';
import { generateWorkoutPlan } from './workout-plan-generator';
import { 
  WorkoutPlanGeneratorInput, 
  WorkoutPlanGeneratorInputSchema, 
  WorkoutPlanGeneratorOutputSchema,
  ShoppingAssistantInput,
  ShoppingAssistantInputSchema,
  ShoppingAssistantOutputSchema,
  ShoppingAssistantOutput
} from '@/lib/definitions';

// ========================
// Tools
// ========================
const searchProductsTool = ai.defineTool({
  name: 'searchProducts',
  description: 'Busca productos de fitness y nutrición basándose en la consulta del usuario.',
  inputSchema: z.object({ query: z.string() }),
  outputSchema: z.array(z.object({ title: z.string(), description: z.string(), price: z.string(), handle: z.string() })),
}, async ({ query }) => {
  const allProducts = await getProducts();
  const q = query.toLowerCase();
  return allProducts
    .filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q)))
    .map(p => ({ title: p.title, description: p.description, price: p.price, handle: p.handle }));
});

const generatePlanTool = ai.defineTool({
  name: 'generateWorkoutPlan',
  description: 'Genera un plan de entrenamiento personalizado para el usuario.',
  inputSchema: WorkoutPlanGeneratorInputSchema,
  outputSchema: z.object({ plan: WorkoutPlanGeneratorOutputSchema, userInput: WorkoutPlanGeneratorInputSchema }),
}, async (input: WorkoutPlanGeneratorInput) => {
  const plan = await generateWorkoutPlan(input);
  return { plan, userInput: input };
});

// ========================
// Prompt
// ========================
const shoppingAssistantPrompt = ai.definePrompt({
  name: 'shoppingAssistantPrompt',
  model: 'gemini-1.5-flash',
  tools: [searchProductsTool, generatePlanTool],
  input: { schema: ShoppingAssistantInputSchema },
  prompt: `
Eres un asistente experto para VM Fitness Hub. Tu objetivo es guiar proactivamente a los usuarios hacia productos o planes que les ayuden.

Historial:
{{#each history}}- {{this.role}}: {{this.content}}
{{/each}}

Consulta del Usuario:
Usuario: {{{query}}}

Responde con claridad, motivación y autoridad. Usa herramientas cuando sea necesario y ofrece fallback amigable si no hay datos.
`,
});

// ========================
// Flow
// ========================
const shoppingAssistantFlowRunner = ai.defineFlow({
  name: 'shoppingAssistantFlow',
  inputSchema: ShoppingAssistantInputSchema,
  outputSchema: ShoppingAssistantOutputSchema,
}, async (input) => {
  // Normalize history
  const history = (input.history || []).map(msg => ({ role: msg.role, parts: [{ text: msg.content.slice(0, 500) }] }));

  const llmResponse = await shoppingAssistantPrompt.generate({ history, messages: [{ role: 'user', parts: [{ text: input.query.slice(0, 500) }] }] });
  const toolCalls = llmResponse.toolCalls();

  console.log('[ShoppingAssistant] Tool calls detected:', toolCalls.map(t => t.name));

  // Handle Workout Plan
  const planToolCall = toolCalls.find(tc => tc.name === 'generateWorkoutPlan');
  if (planToolCall) {
    const toolResponse = await llmResponse.toolRequest()?.functionCall<any>('generateWorkoutPlan', planToolCall.args);
    return {
      response: '¡Aquí tienes! He creado un plan de entrenamiento personalizado para ti.',
      generatedPlan: toolResponse?.plan,
      userInput: toolResponse?.userInput,
    };
  }

  // Handle Product Search
  const productToolCall = toolCalls.find(tc => tc.name === 'searchProducts');
  if (productToolCall) {
    const products = await llmResponse.toolRequest()?.functionCall<any>('searchProducts', productToolCall.args);
    return {
      response: products && products.length > 0
        ? `He encontrado estos productos que podrían ayudarte:\n${products.map((p: any) => `- ${p.title} (${p.price})`).join('\n')}`
        : 'No encontré productos exactos para tu consulta, pero puedo ayudarte a generar un plan personalizado.',
    };
  }

  // Fallback response
  return {
    response: llmResponse.text() || '¡Hola! No pude encontrar una respuesta precisa. ¿Quieres que te ayude a generar un plan o buscar productos?',
  };
});

export async function shoppingAssistantFlow(input: ShoppingAssistantInput): Promise<ShoppingAssistantOutput> {
  return shoppingAssistantFlowRunner(input);
}
