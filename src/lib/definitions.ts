
import type { User as FirebaseUser } from 'firebase/auth';
import { z } from 'zod';

export type Product = {
  id: string;
  handle: string;
  title: string;
  description: string;
  price: string;
  rawPrice: number;
  imageId: string;
  stripePriceId: string; // <-- Added Stripe Price ID
  tags: string[];
};

export type Article = {
  id:string;
  handle: string;
  title: string;
  contentHtml: string;
  excerpt: string;
  imageId: string;
  publishedAt: string;
  audioDataUri?: string; // Audio summary for the article
};

const ObjectiveEnum = z.enum(['fat_loss', 'muscle_gain', 'maintenance']);
const ExperienceEnum = z.enum(['beginner', 'intermediate', 'advanced']);

export const WorkoutPlanGeneratorInputSchema = z.object({
  objective: ObjectiveEnum.describe('El objetivo principal del usuario (perder grasa, ganar músculo, mantenimiento).'),
  experience: ExperienceEnum.describe('El nivel de experiencia del usuario (principiante, intermedio, avanzado).'),
  daysPerWeek: z.number().int().min(2).max(6).describe('El número de días a la semana que el usuario puede entrenar.'),
  preferences: z.string().optional().describe('Preferencias o limitaciones adicionales del usuario (ej. "enfocarse en glúteos", "lesión en la rodilla", "prefiere peso corporal").'),
});
export type WorkoutPlanGeneratorInput = z.infer<typeof WorkoutPlanGeneratorInputSchema>;

export const WorkoutPlanGeneratorOutputSchema = z.object({
  title: z.string().describe('Un título creativo y motivador para el plan de entrenamiento. Por ejemplo: "Plan de Fuerza y Definición: 4 Días Intensos".'),
  summary: z.string().describe('Un resumen de 1-2 frases que describe el enfoque del plan, basado en los objetivos del usuario.'),
  weeklySchedule: z.array(
    z.object({
      day: z.string().describe("El día de entrenamiento (ej: 'Día 1: Tren Superior', 'Día 2: Piernas y Glúteos', 'Día 3: Descanso Activo')."),
      description: z.string().describe("La descripción detallada de los ejercicios para ese día, incluyendo series y repeticiones. Formatea esto con saltos de línea para que sea legible. Por ejemplo: '1. Sentadillas: 3x12\\n2. Zancadas: 3x15 por pierna\\n3. Peso Muerto Rumano: 3x12'."),
    })
  ).describe('El plan de entrenamiento semanal detallado. El número de días de entrenamiento debe coincidir con el solicitado por el usuario.'),
  callToAction: z.string().optional().describe('Un llamado a la acción para animar a la usuaria a guardar el plan o explorar más opciones.'),
});
export type WorkoutPlanGeneratorOutput = z.infer<typeof WorkoutPlanGeneratorOutputSchema>;

export interface WorkoutPlan extends WorkoutPlanGeneratorOutput {
  id: string;
  createdAt: string;
  // Fields for admin review
  status?: 'pending' | 'approved' | 'denied';
  objective?: string;
  experience?: string;
}

export type WorkoutPlanGeneratorInputData = WorkoutPlanGeneratorInput;


export const ShoppingAssistantInputSchema = z.object({
  query: z.string().describe('La consulta del usuario sobre productos o planes de fitness.'),
  history: z.array(
    z.object({ role: z.enum(['user','assistant']), content: z.string() })
  ).optional(),
});
export type ShoppingAssistantInput = z.infer<typeof ShoppingAssistantInputSchema>;

export const ShoppingAssistantOutputSchema = z.object({
  response: z.string().describe('Respuesta final del asistente.'),
  generatedPlan: WorkoutPlanGeneratorOutputSchema.optional(),
  userInput: WorkoutPlanGeneratorInputSchema.optional(),
});
export type ShoppingAssistantOutput = z.infer<typeof ShoppingAssistantOutputSchema>;


// Extend the Firebase User type to include our custom fields
export interface User extends Partial<FirebaseUser> {
  isAdmin?: boolean;
}
