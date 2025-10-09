'use server';

import { firestore } from '@/firebase/server';
import type { WorkoutPlan } from '@/lib/definitions';

export async function saveWorkoutPlan(userId: string, plan: Omit<WorkoutPlan, 'id' | 'createdAt'>): Promise<void> {
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const userWorkoutPlansRef = firestore.collection('users').doc(userId).collection('workoutPlans');
  
  await userWorkoutPlansRef.add({
    ...plan,
    createdAt: new Date(),
  });
}
