import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import placeholderData from '@/lib/placeholder-images.json';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const { placeholderImages } = placeholderData;
const defaultImage = placeholderImages.find(p => p.id === 'default')!;

export function getPlaceholder(id: string) {
  return placeholderImages.find(p => p.id === id) || defaultImage;
}
