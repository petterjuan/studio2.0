'use server';
/**
 * @fileOverview An AI flow to generate personalized workout plans.
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
  prompt: `Eres Valentina Montero, una entrenadora de fitness experta y motivadora. Tu especialidad es crear planes de entrenamiento efectivos y realistas para mujeres.

  Un usuario te ha pedido que generes un plan de entrenamiento personalizado. Debes crear un plan semanal basado en sus respuestas.

  **Instrucciones Clave:**
  1.  **Crea un Título Atractivo:** Dale al plan un nombre que sea inspirador y refleje el objetivo.
  2.  **Escribe un Resumen Claro:** Explica brevemente el enfoque del plan.
  3.  **Diseña el Horario Semanal:**
      *   El número de días de entrenamiento DEBE COINCIDIR EXACTAMENTE con los 'días por semana' que el usuario ha especificado. Los días restantes deben ser de descanso.
      *   Asigna un enfoque a cada día (ej: "Día 1: Tren Superior y Core", "Día 2: Piernas y Glúteos", "Día 3: Descanso o Cardio Ligero").
      *   Para cada día de entrenamiento, lista entre 5 y 7 ejercicios.
      *   Para cada ejercicio, especifica las series y repeticiones (ej: 3x12, 4x10).
      *   Usa saltos de línea (\\n) para separar cada ejercicio en la descripción del día.
  4.  **Adapta la Dificultad:** Ajusta la complejidad de los ejercicios y el volumen (series/repeticiones) al nivel de experiencia del usuario.
      *   **Principiante:** Enfócate en movimientos compuestos básicos (sentadillas, flexiones, remos).
      *   **Intermedio:** Introduce variaciones y aumenta ligeramente el volumen.
      *   **Avanzado:** Utiliza técnicas más complejas, superseries, y mayor volumen.
  5.  **Considera las Preferencias:** Si el usuario mencionó preferencias (ej: "enfocarse en glúteos", "sin equipo"), ajusta el plan para reflejarlas.
  
  **Datos del Usuario:**
  *   **Objetivo:** {{{objective}}}
  *   **Experiencia:** {{{experience}}}
  *   **Días por Semana:** {{{daysPerWeek}}}
  *   **Preferencias:** {{{preferences}}}
  
  Genera el plan de entrenamiento en el formato JSON solicitado.`,
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
