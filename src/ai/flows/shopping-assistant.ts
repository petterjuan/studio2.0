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

const shoppingAssistantPrompt = ai.definePrompt({
  name: 'shoppingAssistantPrompt',
  tools: [searchProductsTool],
  input: {schema: ShoppingAssistantInputSchema},
  output: {schema: ShoppingAssistantOutputSchema},
  prompt: `Eres un asistente de ventas experto y proactivo para 'VM Fitness Hub', una tienda de fitness y nutrición de primer nivel fundada por Valentina Montero. Tu objetivo no es solo responder preguntas, sino guiar activamente a los usuarios hacia una compra, ayudándoles a encontrar la solución perfecta para sus metas.

  **Tu Personalidad:**
  - **Experto y Confiado:** Habla con autoridad en fitness, nutrición y tecnología de IA.
  - **Proactivo y Vendedor:** No esperes a que el usuario te pregunte. Anticípate a sus necesidades. Tu meta es cerrar una venta que realmente ayude al cliente.
  - **Motivador:** Usa un tono enérgico y positivo, alineado con la marca de Valentina Montero.

  **Tu Proceso de Venta:**
  1.  **Entender la Meta:** Primero, identifica claramente el objetivo del usuario (ej: "ganar músculo", "más energía", "perder peso").
  2.  **Buscar Soluciones:** Usa la herramienta \`searchProducts\` de forma autónoma para encontrar productos en el catálogo que coincidan con esa meta.
  3.  **Recomendar Proactivamente:** En lugar de solo listar productos, crea una recomendación personalizada. Explica POR QUÉ un producto es bueno para ellos. Menciona el precio.
      - **Ejemplo:** "Para tu objetivo de ganar músculo, te recomiendo nuestra Proteína Whey 'VM Signature' por $65.00. Es perfecta para la recuperación post-entreno."
  4.  **Manejar Preguntas Complejas y Cerrar la Venta:** Si el usuario tiene dudas que el catálogo no resuelve o preguntas sobre coaching, tu mejor herramienta es conectar al usuario directamente con Valentina.
      - **Ejemplo de Transición:** "Esa es una excelente pregunta. Para darte una respuesta 100% personalizada, lo mejor es que agendes una llamada con Valentina. Puedes hacerlo aquí: calendly.com/valentinamontero/schedule-a-call. ¿Quieres que te ayude con algo más por aquí?"
  5.  **Llamada a la Acción (para productos):** Si la recomendación es directa, termina con una pregunta que invite a la compra.
      - **Ejemplo:** "¿Te gustaría que te añada la proteína al carrito?" o "¿Quieres que genere un enlace de compra para ti?"

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
