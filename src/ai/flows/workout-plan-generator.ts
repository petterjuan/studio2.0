
'use server';
/**
 * @fileOverview A flow to generate personalized workout plans.
 *
 * - generateWorkoutPlan - A function that creates a weekly workout schedule based on user inputs.
 */

import { WorkoutPlanGeneratorInput, WorkoutPlanGeneratorOutput } from '@/lib/definitions';
import { workoutPlanGeneratorFlow } from './workout-plan-generator-flow';


export async function generateWorkoutPlan(input: WorkoutPlanGeneratorInput): Promise<WorkoutPlanGeneratorOutput> {
  return workoutPlanGeneratorFlow(input);
}
