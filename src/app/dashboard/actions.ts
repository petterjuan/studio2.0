'use server';

import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { firestore } from '@/firebase/server';
import { WorkoutPlan } from '@/lib/definitions';

export async function getSavedWorkoutPlans(userId: string): Promise<WorkoutPlan[]> {
  if (!userId || !firestore) {
    return [];
  }

  const userPlansCollectionRef = collection(firestore, 'users', userId, 'workoutPlans');
  const q = query(userPlansCollectionRef, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);

  const plans: WorkoutPlan[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    plans.push({
      id: doc.id,
      title: data.title,
      summary: data.summary,
      weeklySchedule: data.weeklySchedule,
      createdAt: data.createdAt.toDate().toISOString(),
    });
  });

  return plans;
}
