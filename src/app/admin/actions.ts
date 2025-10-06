'use server';

import { collectionGroup, getDocs, query, orderBy, getDoc } from 'firebase/firestore';
import { firestore as adminFirestore } from '@/firebase/server';
import { WorkoutPlan } from '@/lib/definitions';

type UserWorkoutPlan = WorkoutPlan & { userName: string; userEmail: string; };

export async function getAllWorkoutPlans(): Promise<UserWorkoutPlan[]> {
  // Firestore is not available on the client, so we must use the admin SDK
  // This function is a server action, so it will only run on the server
  const plansQuery = query(collectionGroup(adminFirestore, 'workoutPlans'), orderBy('createdAt', 'desc'));
  const plansSnapshot = await getDocs(plansQuery);

  const plans: UserWorkoutPlan[] = [];

  for (const doc of plansSnapshot.docs) {
    const data = doc.data();
    const userRef = doc.ref.parent.parent;
    
    if (userRef) {
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
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
  }

  return plans;
}
