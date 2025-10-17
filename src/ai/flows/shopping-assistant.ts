
'use server';
/**
 * @fileOverview Smart shopping assistant flow that helps users find fitness and nutrition products.
 *
 * - shoppingAssistant - A function that handles the shopping assistant conversation.
 * - ShoppingAssistantInput - The input type for the shoppingAssistant function.
 * - ShoppingAssistantOutput - The return type for the shoppingAssistant function.
 */

import {ai} from '@/ai/genkit';
import { getProducts } from '@/lib/products';
import {z} from 'genkit';
import { generateWorkoutPlan, WorkoutPlanGeneratorInput, WorkoutPlanGeneratorOutputSchema } from './workout-plan-generator';

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
  response: z.string().describe('La respuesta del asistente de compras inteligente.'),
  generatedPlan: WorkoutPlanGeneratorOutputSchema.optional().describe('Un plan de entrenamiento si se generó uno.'),
});
export type ShoppingAssistantOutput = z.infer<typeof ShoppingAssistantOutputSchema>;

export async function shoppingAssistant(input: ShoppingAssistantInput): Promise<ShoppingAssistantOutput> {
  return shoppingAssistantFlow(input);
}

const searchProductsTool = ai.defineTool({
  name: 'searchProducts',
  description: 'Busca en el catálogo de productos basándose en una consulta o objetivo del usuario (ej: "ganar músculo", "proteína", "perder peso").',
  inputSchema: z.object({
    query: z.string().describe('La consulta de búsqueda para encontrar productos relevantes.'),
  }),
  outputSchema: z.array(z.object({
    title: z.string(),
    description: z.string(),
    price: z.string(),
    handle: z.string(),
  })),
}, async (input) => {
  const allProducts = await getProducts();
  const query = input.query.toLowerCase();
  
  const filteredProducts = allProducts.filter(product => 
    product.title.toLowerCase().includes(query) || 
    product.description.toLowerCase().includes(query) ||
    product.tags.some(tag => tag.toLowerCase().includes(query))
  );

  // Return a subset of product data
  return filteredProducts.map(p => ({
    title: p.title,
    description: p.description,
    price: p.price,
    handle: p.handle,
  }));
});

const generatePlanTool = ai.defineTool({
    name: 'generateWorkoutPlan',
    description: "Genera un plan de entrenamiento personalizado para el usuario si lo solicita o si expresa una meta de fitness clara (ej. 'quiero perder peso', 'cómo puedo ganar músculo').",
    inputSchema: z.object({
        objective: z.enum(['fat_loss', 'muscle_gain', 'maintenance']).describe('El objetivo principal del usuario.'),
        experience: z.enum(['beginner', 'intermediate', 'advanced']).describe('El nivel de experiencia del usuario.'),
        daysPerWeek: z.string().describe('El número de días a la semana, inferido de la conversación o un valor por defecto razonable (3-4).'),
        preferences: z.string().optional().describe('Preferencias o limitaciones adicionales del usuario.'),
    }),
    outputSchema: WorkoutPlanGeneratorOutputSchema,
}, async (input) => {
    return await generateWorkoutPlan(input);
});

const shoppingAssistantPrompt = ai.definePrompt({
  name: 'shoppingAssistantPrompt',
  model: 'gemini-1.5-flash',
  tools: [searchProductsTool, generatePlanTool],
  input: {schema: ShoppingAssistantInputSchema},
  output: {schema: ShoppingAssistantOutputSchema},
  prompt: `Eres un asistente de ventas experto y proactivo para 'VM Fitness Hub', una tienda de fitness y nutrición de primer nivel fundada por Valentina Montero. Tu objetivo no es solo responder preguntas, sino guiar activamente a los usuarios hacia una compra o una acción valiosa, como generar un plan.

  **Tu Personalidad:**
  - **Experto y Confiado:** Habla con autoridad en fitness, nutrición y tecnología de IA.
  - **Proactivo y Servicial:** No esperes a que el usuario te pregunte. Anticípate a sus necesidades. Tu meta es cerrar una venta o generar un plan que realmente ayude al cliente.
  - **Motivador:** Usa un tono enérgico y positivo, alineado con la marca de Valentina Montero.

  **Tu Proceso:**
  1.  **Entender la Meta:** Primero, identifica claramente el objetivo del usuario (ej: "ganar músculo", "más energía", "perder peso", "necesito una rutina").
  2.  **Buscar Soluciones (Productos):** Si el usuario pregunta por productos, usa la herramienta \`searchProducts\` para encontrar soluciones en el catálogo. Recomienda proactivamente explicando POR QUÉ un producto es bueno para ellos y menciona el precio.
  3.  **Generar Planes (Proactivamente):** Si el usuario expresa una meta de fitness pero no pregunta por productos (ej. "quiero empezar a entrenar", "cómo puedo perder grasa"), usa la herramienta \`generateWorkoutPlan\`. Infiere los parámetros a partir de la conversación. Si no tienes suficiente información, pide los detalles que te faltan (ej. "¡Claro que sí! Para crearte el mejor plan, dime, ¿cuántos días a la semana te gustaría entrenar y qué nivel de experiencia tienes?").
  4.  **Presentar el Plan:** Una vez que el plan esté generado, preséntalo de forma resumida en la respuesta de texto y adjunta el plan completo en el campo \`generatedPlan\`.
  5.  **Manejar Preguntas Complejas:** Si las dudas del usuario exceden las herramientas, sugiere agendar una llamada con Valentina: "Para darte una respuesta 100% personalizada, lo mejor es que agendes una llamada con Valentina en calendly.com/valentinamontero/schedule-a-call".

  **Historial de la Conversación:**
  {{#each history}}
  - {{this.role}}: {{this.content}}
  {{/each}}

  **Consulta del Usuario:**
  Usuario: {{{query}}}
  
  **Tu Próxima Acción:**
  Asistente:`,
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
