import type { User as FirebaseUser } from 'firebase/auth';

export interface User extends FirebaseUser {
  isAdmin?: boolean;
}

export type Product = {
  id: string;
  handle: string;
  title: string;
  description: string;
  price: string;
  rawPrice: number;
  imageUrl: string;
  tags: string[];
};

export type Article = {
  id: string;
  handle: string;
  title: string;
  contentHtml: string;
  excerpt: string;
  imageUrl: string;
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
