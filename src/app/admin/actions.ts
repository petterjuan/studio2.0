'use server';

import { collectionGroup, getDocs, query, orderBy, getDoc, DocumentData, doc, updateDoc } from 'firebase/firestore';
import { firestore as adminFirestore, getCurrentUser } from '@/firebase/server';
import type { WorkoutPlan } from '@/lib/definitions';
import { reviewWorkoutPlan } from '@/ai/flows/admin-review-flow';

type UserWorkoutPlan = WorkoutPlan & { 
    userName: string; 
    userEmail: string; 
    status: 'pending' | 'approved' | 'denied';
    aiRecommendation?: 'Approve' | 'Deny';
    aiReason?: string;
};

async function updatePlanStatus(planId: string, status: 'approved' | 'denied'): Promise<{success: boolean, error?: string}> {
  const user = await getCurrentUser();
  if (!user || !user.isAdmin) {
    return { success: false, error: "No autorizado" };
  }

  // Find the plan across all users
  const plansQuery = query(collectionGroup(adminFirestore, 'workoutPlans'));
  const plansSnapshot = await getDocs(plansQuery);
  const planDoc = plansSnapshot.docs.find(d => d.id === planId);

  if (!planDoc) {
    return { success: false, error: "Plan no encontrado" };
  }

  await updateDoc(planDoc.ref, { status });
  return { success: true };
}

export async function approveWorkoutPlan(planId: string) {
  return updatePlanStatus(planId, 'approved');
}

export async function denyWorkoutPlan(planId: string) {
  return updatePlanStatus(planId, 'denied');
}


export async function getAllWorkoutPlans(): Promise<UserWorkoutPlan[]> {
  const user = await getCurrentUser();
  
  if (!user || !user.isAdmin) {
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

        // Run AI review
        const review = await reviewWorkoutPlan({
            userObjective: data.objective || 'Not specified',
            userExperience: data.experience || 'Not specified',
            planTitle: data.title,
            planSummary: data.summary
        });
        
        plans.push({
            id: docSnapshot.id,
            title: data.title,
            summary: data.summary,
            weeklySchedule: data.weeklySchedule,
            createdAt: data.createdAt.toDate().toISOString(),
            userName: userData?.name || 'Usuario Desconocido',
            userEmail: userData?.email || 'Sin correo',
            status: data.status || 'pending',
            aiRecommendation: review.recommendation,
            aiReason: review.reason
        });
    }
  }

  return plans;
}
