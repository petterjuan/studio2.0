'use server';

import { collectionGroup, getDocs, query, orderBy, getDoc, DocumentData } from 'firebase/firestore';
import { firestore as adminFirestore } from '@/firebase/server';
import type { WorkoutPlan } from '@/lib/definitions';

type UserWorkoutPlan = WorkoutPlan & { userName: string; userEmail: string; };

export async function getAllWorkoutPlans(): Promise<UserWorkoutPlan[]> {
  if (!adminFirestore?.collectionGroup) {
    console.warn("Firestore Admin SDK not initialized. Skipping getAllWorkoutPlans.");
    return [];
  }
  
  const plansQuery = query(collectionGroup(adminFirestore, 'workoutPlans'), orderBy('createdAt', 'desc'));
  const plansSnapshot = await getDocs(plansQuery);

  const plans: UserWorkoutPlan[] = [];

  for (const docSnapshot of plansSnapshot.docs) {
    const data = docSnapshot.data();
    const userRef = docSnapshot.ref.parent.parent;
    
    if (userRef) {
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
            const userData = userDoc.data() as DocumentData;
            plans.push({
                id: docSnapshot.id,
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
