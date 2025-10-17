
'use server';

import { firestore } from '@/firebase/server';
import type { WorkoutPlan, WorkoutPlanGeneratorInputData } from '@/lib/definitions';
import { FieldValue } from 'firebase-admin/firestore';

export async function saveWorkoutPlan(userId: string, plan: Omit<WorkoutPlan, 'id' | 'createdAt'>, userInput: WorkoutPlanGeneratorInputData): Promise<void> {
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const userWorkoutPlansRef = firestore.collection('users').doc(userId).collection('workoutPlans');
  
  await userWorkoutPlansRef.add({
    ...plan,
    ...userInput,
    createdAt: FieldValue.serverTimestamp(),
    status: 'pending' // Initial status
  });
}
