'use server';

import { generateCustomWorkoutPlan, GenerateCustomWorkoutPlanInput, GenerateCustomWorkoutPlanOutput } from '@/ai/flows/generate-custom-workout-plan';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '@/firebase/server';
import { revalidatePath } from 'next/cache';
import { WorkoutPlan } from '@/lib/definitions';

export async function handleGenerateWorkout(
    input: GenerateCustomWorkoutPlanInput
  ): Promise<{ plan: GenerateCustomWorkoutPlanOutput | null; error: string | null }> {
    try {
      const plan = await generateCustomWorkoutPlan(input);
      return { plan, error: null };
    } catch (error) {
      console.error('Error generating workout plan:', error);
      return { plan: null, error: 'Failed to generate workout plan. Please try again.' };
    }
}

export async function saveWorkoutPlan(plan: WorkoutPlan, userId: string): Promise<void> {
    if (!userId) {
      throw new Error('User is not authenticated.');
    }
  
    const userPlansCollectionRef = collection(firestore, 'users', userId, 'workoutPlans');
    await addDoc(userPlansCollectionRef, {
      ...plan,
      createdAt: serverTimestamp(),
    });

    revalidatePath('/dashboard');
}

// Ensure firebase/server.ts exists
