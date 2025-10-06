'use server';

import { collectionGroup, getDocs, query, orderBy } from 'firebase/firestore';
import { firestore } from '@/firebase/server';
import { WorkoutPlan } from '@/lib/definitions';

type UserWorkoutPlan = WorkoutPlan & { userName: string; userEmail: string; };

export async function getAllWorkoutPlans(): Promise<UserWorkoutPlan[]> {
  if (!firestore) {
    console.log("Firestore not initialized for server.");
    return [];
  }
  const plansQuery = query(collectionGroup(firestore, 'workoutPlans'), orderBy('createdAt', 'desc'));
  const plansSnapshot = await getDocs(plansQuery);

  const plans: UserWorkoutPlan[] = [];

  for (const doc of plansSnapshot.docs) {
    const data = doc.data();
    const userRef = doc.ref.parent.parent;
    
    if (userRef) {
        const userDoc = await userRef.get();
        const userData = userDoc.data();

        plans.push({
            id: doc.id,
            title: data.title,
            summary: data.summary,
            weeklySchedule: data.weeklySchedule,
            createdAt: data.createdAt.toDate().toISOString(),
            userName: userData?.name || 'Usuario Desconocido',
            userEmail: userData?.email || 'Sin correo',
        });
    }
  }

  return plans;
}
