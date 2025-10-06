import type { User as FirebaseUser } from 'firebase/auth';

export interface User extends FirebaseUser {
  isAdmin?: boolean;
}

export type DailyWorkout = {
  day: string;
  focus: string;
  exercises: {
    name: string;
    sets: string;
    reps: string;
    rest?: string;
    notes?: string;
  }[];
};

export type WorkoutPlan = {
  id?: string;
  title: string;
  weeklySchedule: DailyWorkout[];
  summary: string;
  createdAt?: any;
};

export type ShopifyProduct = {
  id: string;
  handle: string;
  title: string;
  description: string;
  price: string;
  imageUrl: string;
  tags: string[];
};

export type ShopifyArticle = {
  id: string;
  handle: string;
  title: string;
  contentHtml: string;
  excerpt: string;
  imageUrl: string;
  publishedAt: string;
};
