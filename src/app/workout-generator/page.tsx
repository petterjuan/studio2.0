import Image from 'next/image';
import WorkoutGeneratorForm from './workout-generator-form';
import placeholderData from '@/lib/placeholder-images.json';
import { Card } from '@/components/ui/card';

const { placeholderImages } = placeholderData;
const bgImage = placeholderImages.find(p => p.id === 'workout-generator-bg') || placeholderImages[0];

export default function WorkoutGeneratorPage() {
  return (
    <div className="min-h-screen">
      <section className="relative py-24 md:py-32 flex items-center justify-center text-center text-white">
        <Image
          src={bgImage.imageUrl}
          alt={bgImage.description}
          data-ai-hint={bgImage.imageHint}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 p-4 max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline tracking-tight">
            Your Personal AI Fitness Coach
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto font-body">
            Tell us your goals, and our AI will create a unique workout plan just for you. Your fitness journey, redefined.
          </p>
        </div>
      </section>

      <section className="container -mt-16 relative z-20 pb-24">
        <div className="max-w-4xl mx-auto">
          <WorkoutGeneratorForm />
        </div>
      </section>
    </div>
  );
}
