'use server';
/**
 * @fileOverview A flow to generate personalized workout plans.
 *
 * - generateWorkoutPlan - A function that creates a weekly workout schedule based on user inputs.
 * - WorkoutPlanGeneratorInput - The input type for the plan generation.
 * - WorkoutPlanGeneratorOutput - The return type (the workout plan).
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ObjectiveEnum = z.enum(['fat_loss', 'muscle_gain', 'maintenance']);
const ExperienceEnum = z.enum(['beginner', 'intermediate', 'advanced']);

const WorkoutPlanGeneratorInputSchema = z.object({
  objective: ObjectiveEnum.describe('El objetivo principal del usuario (perder grasa, ganar músculo, mantenimiento).'),
  experience: ExperienceEnum.describe('El nivel de experiencia del usuario (principiante, intermedio, avanzado).'),
  daysPerWeek: z.string().describe('El número de días a la semana que el usuario puede entrenar.'),
  preferences: z.string().optional().describe('Preferencias o limitaciones adicionales del usuario (ej. "enfocarse en glúteos", "lesión en la rodilla", "prefiere peso corporal").'),
});
export type WorkoutPlanGeneratorInput = z.infer<typeof WorkoutPlanGeneratorInputSchema>;

const WorkoutPlanGeneratorOutputSchema = z.object({
  title: z.string().describe('Un título creativo y motivador para el plan de entrenamiento. Por ejemplo: "Plan de Fuerza y Definición: 4 Días Intensos".'),
  summary: z.string().describe('Un resumen de 1-2 frases que describe el enfoque del plan, basado en los objetivos del usuario.'),
  weeklySchedule: z.array(
    z.object({
      day: z.string().describe("El día de entrenamiento (ej: 'Día 1: Tren Superior', 'Día 2: Piernas y Glúteos', 'Día 3: Descanso Activo')."),
      description: z.string().describe("La descripción detallada de los ejercicios para ese día, incluyendo series y repeticiones. Formatea esto con saltos de línea para que sea legible. Por ejemplo: '1. Sentadillas: 3x12\\n2. Zancadas: 3x15 por pierna\\n3. Peso Muerto Rumano: 3x12'."),
    })
  ).describe('El plan de entrenamiento semanal detallado. El número de días de entrenamiento debe coincidir con el solicitado por el usuario.'),
});

export type WorkoutPlanGeneratorOutput = z.infer<typeof WorkoutPlanGeneratorOutputSchema>;

export async function generateWorkoutPlan(input: WorkoutPlanGeneratorInput): Promise<WorkoutPlanGeneratorOutput> {
  return workoutPlanGeneratorFlow(input);
}

const workoutPlanPrompt = ai.definePrompt({
  name: 'workoutPlanPrompt',
  input: { schema: WorkoutPlanGeneratorInputSchema },
  output: { schema: WorkoutPlanGeneratorOutputSchema },
  prompt: `Eres Valentina Montero, una reconocida coach de fitness y nutrición, experta en crear transformaciones físicas para mujeres. Tu tono es empoderador, conocedor y motivador. No solo creas planes, diseñas estilos de vida.

  Una usuaria te ha pedido que generes un plan de entrenamiento personalizado. Debes crear un plan semanal basado en sus respuestas.

  **Instrucciones Clave:**
  1.  **Precisión Absoluta en los Días:** El número de objetos en el array \`weeklySchedule\` DEBE SER EXACTAMENTE IGUAL al número de \`daysPerWeek\` que la usuaria ha especificado. Si la usuaria pide 3 días, el array debe tener 3 elementos, ni más ni menos. NO añadas días de descanso ni crees un plan para 7 días.
  2.  **Crea un Título Orientado a Resultados:** El título debe ser atractivo y prometer una transformación. Por ejemplo: "Reto de Glúteos en 4 Semanas" o "Plan de Definición Total: Tu Rutina de 3 Días".
  3.  **Resumen de Experta:** El resumen debe explicar el "porqué" del plan, como lo haría una coach que entiende las metas de su clienta.
  4.  **Diseña los Entrenamientos:**
      *   Asigna un enfoque claro a cada día (ej: "Día 1: Tren Superior y Core", "Día 2: Piernas y Glúteos").
      *   Para cada día de entrenamiento, lista entre 5 y 7 ejercicios efectivos.
      *   Para cada ejercicio, especifica las series y repeticiones (ej: 4x10, 3x12).
      *   Usa saltos de línea (\\n) para separar cada ejercicio y que sea fácil de leer.
  5.  **Adapta la Dificultad (Como una Profesional):**
      *   **Principiante:** Enfócate en la técnica con movimientos compuestos básicos (sentadillas, flexiones, remos).
      *   **Intermedia:** Introduce variaciones, aumenta el volumen y la intensidad (ej. superseries).
      *   **Avanzada:** Usa técnicas más complejas (series descendentes, pausas-descanso), y mayor volumen e intensidad.
  6.  **Considera las Preferencias:** Si la usuaria mencionó preferencias (ej: "enfocarse en glúteos", "sin equipo"), el plan DEBE reflejarlo como prioridad.
  
  **Datos de la Usuaria:**
  *   **Objetivo:** {{{objective}}}
  *   **Experiencia:** {{{experience}}}
  *   **Días por Semana:** {{{daysPerWeek}}}
  *   **Preferencias:** {{{preferences}}}
  
  Genera el plan de entrenamiento en el formato JSON solicitado, siguiendo estas reglas estrictamente.`,
});

const workoutPlanGeneratorFlow = ai.defineFlow(
  {
    name: 'workoutPlanGeneratorFlow',
    inputSchema: WorkoutPlanGeneratorInputSchema,
    outputSchema: WorkoutPlanGeneratorOutputSchema,
  },
  async (input) => {
    const { output } = await workoutPlanPrompt(input);
    return output!;
  }
);
