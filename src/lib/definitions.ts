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
