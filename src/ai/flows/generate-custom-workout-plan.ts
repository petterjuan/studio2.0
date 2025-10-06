'use server';

/**
 * @fileOverview AI flow that generates personalized workout plans based on user inputs.
 *
 * - generateCustomWorkoutPlan - A function that generates a personalized workout plan.
 * - GenerateCustomWorkoutPlanInput - The input type for the generateCustomWorkoutPlan function.
 * - GenerateCustomWorkoutPlanOutput - The return type for the generateCustomWorkoutPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCustomWorkoutPlanInputSchema = z.object({
  fitnessGoals: z
    .string()
    .describe('Los objetivos de fitness del usuario (ej., pérdida de peso, ganancia muscular, mejora de la resistencia).'),
  experienceLevel: z
    .enum(['beginner', 'intermediate', 'advanced'])
    .describe('El nivel de experiencia del usuario (principiante, intermedio o avanzado).'),
  availableEquipment: z
    .string()
    .describe('El equipamiento disponible para el usuario (ej., mancuernas, bandas de resistencia, acceso a gimnasio).'),
  workoutDuration: z
    .number()
    .describe('¿Cuánto debe durar el entrenamiento en minutos?'),
  workoutFrequency: z
    .number()
    .describe('¿Cuántos días a la semana puede entrenar?'),
});

export type GenerateCustomWorkoutPlanInput = z.infer<typeof GenerateCustomWorkoutPlanInputSchema>;

const DailyWorkoutSchema = z.object({
    day: z.string().describe("Día de la semana o número de sesión (ej., Día 1, Lunes)."),
    focus: z.string().describe("Enfoque principal del día (ej., Tren Superior, Cuerpo Completo, Cardio y Core)."),
    exercises: z.array(z.object({
      name: z.string().describe("Nombre del ejercicio."),
      sets: z.string().describe("Número de series a realizar (ej., '3-4', '3')."),
      reps: z.string().describe("Número de repeticiones por serie (ej., '8-12', 'AMRAP')."),
      rest: z.string().optional().describe("Tiempo de descanso entre series (ej., '60-90 segundos')."),
      notes: z.string().optional().describe("Notas adicionales o instrucciones para el ejercicio."),
    })).describe("Lista de ejercicios para el día.")
});

const GenerateCustomWorkoutPlanOutputSchema = z.object({
  title: z.string().describe("Un título pegadizo y motivador para el plan de entrenamiento."),
  weeklySchedule: z.array(DailyWorkoutSchema).describe("El horario de entrenamiento estructurado para la semana."),
  summary: z.string().describe("Un breve resumen del plan y algunas palabras de motivación para el usuario."),
});


export type GenerateCustomWorkoutPlanOutput = z.infer<typeof GenerateCustomWorkoutPlanOutputSchema>;

export async function generateCustomWorkoutPlan(
  input: GenerateCustomWorkoutPlanInput
): Promise<GenerateCustomWorkoutPlanOutput> {
  return generateCustomWorkoutPlanFlow(input);
}

const generateCustomWorkoutPlanPrompt = ai.definePrompt({
  name: 'generateCustomWorkoutPlanPrompt',
  input: {schema: GenerateCustomWorkoutPlanInputSchema},
  output: {schema: GenerateCustomWorkoutPlanOutputSchema},
  prompt: `Eres un entrenador personal de clase mundial, creando un plan de entrenamiento personalizado.\n
      Perfil del Usuario:\n      - Objetivos de Fitness: {{{fitnessGoals}}}\n      - Nivel de Experiencia: {{{experienceLevel}}}\n      - Equipamiento Disponible: {{{availableEquipment}}}\n      - Duración del Entrenamiento: {{{workoutDuration}}} minutos\n      - Frecuencia del Entrenamiento: {{{workoutFrequency}}} días a la semana\n
      Tu Tarea:\n      Crea un plan de entrenamiento detallado, estructurado y fácil de seguir basado en el perfil del usuario.\n      1.  Genera un título motivador para el plan.\n      2.  Diseña un horario semanal con 'workoutFrequency' días de entrenamiento.\n      3.  Para cada día de entrenamiento, especifica el enfoque (ej., Tren Superior, Tren Inferior, Cuerpo Completo, Cardio).\n      4.  Para cada ejercicio, proporciona el nombre, número de series, repeticiones (reps) y tiempo de descanso.\n      5.  Añade notas breves y útiles para ejercicios complejos si es necesario.\n      6.  Asegúrate de que el plan sea lógico, progresivo y adecuado para el nivel de experiencia y el equipamiento disponible del usuario.\n      7.  Concluye con un resumen y un mensaje motivador.\n
      La salida debe estar en el formato JSON especificado.\n`,
});

const generateCustomWorkoutPlanFlow = ai.defineFlow(
  {
    name: 'generateCustomWorkoutPlanFlow',
    inputSchema: GenerateCustomWorkoutPlanInputSchema,
    outputSchema: GenerateCustomWorkoutPlanOutputSchema,
  },
  async input => {
    const {output} = await generateCustomWorkoutPlanPrompt(input);
    return output!;
  }
);
