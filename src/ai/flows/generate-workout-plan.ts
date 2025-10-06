'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WorkoutPlanInputSchema = z.object({
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

export type WorkoutPlanInput = z.infer<typeof WorkoutPlanInputSchema>;

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

const WorkoutPlanOutputSchema = z.object({
  title: z.string().describe("A catchy and motivational title for the workout plan."),
  weeklySchedule: z.array(DailyWorkoutSchema).describe("The structured workout schedule for the week."),
  summary: z.string().describe("A brief summary of the plan and some motivational words for the user."),
});


export type WorkoutPlanOutput = z.infer<typeof WorkoutPlanOutputSchema>;

export async function generateWorkoutPlan(input: WorkoutPlanInput): Promise<WorkoutPlanOutput> {
  return generateWorkoutPlanFlow(input);
}

const workoutPlanPrompt = ai.definePrompt({
  name: 'workoutPlanPrompt',
  input: {schema: WorkoutPlanInputSchema},
  output: {schema: WorkoutPlanOutputSchema},
  prompt: `You are a world-class personal trainer, creating a personalized workout plan.

      User Profile:
      - Fitness Goals: {{{fitnessGoals}}}
      - Experience Level: {{{experienceLevel}}}
      - Available Equipment: {{{availableEquipment}}}
      - Workout Duration: {{{workoutDuration}}} minutes
      - Workout Frequency: {{{workoutFrequency}}} days a week

      Your Task:
      Create a detailed, structured, and easy-to-follow workout plan based on the user's profile.
      1.  Generate a motivational title for the plan.
      2.  Design a weekly schedule with 'workoutFrequency' number of workout days.
      3.  For each workout day, specify the focus (e.g., Upper Body, Lower Body, Full Body, Cardio).
      4.  For each exercise, provide the name, number of sets, repetitions (reps), and rest time.
      5.  Add brief, helpful notes for complex exercises if necessary.
      6.  Ensure the plan is logical, progressive, and suitable for the user's experience level and available equipment.
      7.  Conclude with a summary and a motivational message.

      Output must be in the specified JSON format.
`,
});

const generateWorkoutPlanFlow = ai.defineFlow(
  {
    name: 'generateWorkoutPlanFlow',
    inputSchema: WorkoutPlanInputSchema,
    outputSchema: WorkoutPlanOutputSchema,
  },
  async input => {
    const {output} = await workoutPlanPrompt(input);
    return output!;
  }
);
