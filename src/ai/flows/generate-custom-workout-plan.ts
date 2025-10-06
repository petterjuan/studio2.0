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
    .describe('The fitness goals of the user (e.g., weight loss, muscle gain, improved endurance).'),
  experienceLevel: z
    .enum(['beginner', 'intermediate', 'advanced'])
    .describe('The experience level of the user (beginner, intermediate, or advanced).'),
  availableEquipment: z
    .string()
    .describe('The equipment available to the user (e.g., dumbbells, resistance bands, gym access).'),
  workoutDuration: z
    .number()
    .describe('How long should the workout be in minutes?'),
  workoutFrequency: z
    .number()
    .describe('How many days a week can they workout?'),
});

export type GenerateCustomWorkoutPlanInput = z.infer<typeof GenerateCustomWorkoutPlanInputSchema>;

const DailyWorkoutSchema = z.object({
    day: z.string().describe("Day of the week or session number (e.g., Day 1, Monday)."),
    focus: z.string().describe("Main focus for the day (e.g., Upper Body, Full Body, Cardio & Core)."),
    exercises: z.array(z.object({
      name: z.string().describe("Name of the exercise."),
      sets: z.string().describe("Number of sets to perform (e.g., '3-4', '3')."),
      reps: z.string().describe("Number of repetitions per set (e.g., '8-12', 'AMRAP')."),
      rest: z.string().optional().describe("Rest time between sets (e.g., '60-90 seconds')."),
      notes: z.string().optional().describe("Additional notes or instructions for the exercise."),
    })).describe("List of exercises for the day.")
});

const GenerateCustomWorkoutPlanOutputSchema = z.object({
  title: z.string().describe("A catchy and motivational title for the workout plan."),
  weeklySchedule: z.array(DailyWorkoutSchema).describe("The structured workout schedule for the week."),
  summary: z.string().describe("A brief summary of the plan and some motivational words for the user."),
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
  prompt: `You are a world-class personal trainer, creating a personalized workout plan.\n
      User Profile:\n      - Fitness Goals: {{{fitnessGoals}}}\n      - Experience Level: {{{experienceLevel}}}\n      - Available Equipment: {{{availableEquipment}}}\n      - Workout Duration: {{{workoutDuration}}} minutes\n      - Workout Frequency: {{{workoutFrequency}}} days a week\n
      Your Task:\n      Create a detailed, structured, and easy-to-follow workout plan based on the user's profile.\n      1.  Generate a motivational title for the plan.\n      2.  Design a weekly schedule with 'workoutFrequency' number of workout days.\n      3.  For each workout day, specify the focus (e.g., Upper Body, Lower Body, Full Body, Cardio).\n      4.  For each exercise, provide the name, number of sets, repetitions (reps), and rest time.\n      5.  Add brief, helpful notes for complex exercises if necessary.\n      6.  Ensure the plan is logical, progressive, and suitable for the user's experience level and available equipment.\n      7.  Conclude with a summary and a motivational message.\n
      Output must be in the specified JSON format.\n`,
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
