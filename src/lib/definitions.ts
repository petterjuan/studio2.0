
import type { User as FirebaseUser } from 'firebase/auth';

export type Product = {
  id: string;
  handle: string;
  title: string;
  description: string;
  price: string;
  rawPrice: number;
  imageId: string;
  stripePriceId: string; // <-- Added Stripe Price ID
  tags: string[];
};

export type Article = {
  id: string;
  handle: string;
  title: string;
  contentHtml: string;
  excerpt: string;
  imageId: string;
  publishedAt: string;
};

export interface WorkoutPlan {
  id: string;
  title: string;
  summary: string;
  weeklySchedule: {
    day: string;
    description: string;
  }[];
  createdAt: string;
  // Fields for admin review
  status?: 'pending' | 'approved' | 'denied';
  objective?: string;
  experience?: string;
}

export type WorkoutPlanGeneratorInputData = {
    objective: 'fat_loss' | 'muscle_gain' | 'maintenance';
    experience: 'beginner' | 'intermediate' | 'advanced';
    daysPerWeek: string;
    preferences?: string;
};


// Extend the Firebase User type to include our custom fields
export interface User extends Partial<FirebaseUser> {
  isAdmin?: boolean;
}
