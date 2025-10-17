
'use server';

import { collectionGroup, getDocs, query, orderBy, getDoc, DocumentData } from 'firebase/firestore';
import { firestore as adminFirestore, getCurrentUser } from '@/firebase/server';
import type { WorkoutPlan } from '@/lib/definitions';

type UserWorkoutPlan = WorkoutPlan & { userName: string; userEmail: string; };

export async function getAllWorkoutPlans(): Promise<UserWorkoutPlan[]> {
  const user = await getCurrentUser();
  
  // Security Enhancement: Only allow admins to fetch all plans.
  if (!user || !user.isAdmin) {
    return [];
  }
  
  if (!adminFirestore) {
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
        const userData = userDoc.data() as DocumentData | undefined;
        
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

  return plans;
}

    