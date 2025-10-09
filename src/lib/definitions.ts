import type { User as FirebaseUser } from 'firebase/auth';

export type Product = {
  id: string;
  handle: string;
  title: string;
  description: string;
  price: string;
  rawPrice: number;
  imageId: string;
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
}


// Extend the Firebase User type to include our custom fields
export interface User extends Partial<FirebaseUser> {
  isAdmin?: boolean;
}
