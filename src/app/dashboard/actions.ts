'use server';

import { firestore } from '@/firebase/server';
import type { WorkoutPlan } from '@/lib/definitions';
import { collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';

export async function getWorkoutPlansForUser(userId: string): Promise<WorkoutPlan[]> {
  if (!userId || !firestore) {
    console.warn("User ID not provided or Firestore not initialized.");
    return [];
  }

  try {
    const plansRef = firestore.collection('users').doc(userId).collection('workoutPlans');
    const q = query(plansRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    const plans: WorkoutPlan[] = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        summary: data.summary,
        weeklySchedule: data.weeklySchedule,
        // Convert Firestore Timestamp to ISO string
        createdAt: (data.createdAt as Timestamp).toDate().toISOString(),
      };
    });

    return plans;
  } catch (error) {
    console.error("Error fetching workout plans for user:", error);
    // In case of an error on the server, return an empty array to avoid breaking the client
    return [];
  }
}
