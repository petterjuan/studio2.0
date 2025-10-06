import Image from 'next/image';
import WorkoutGeneratorForm from './workout-generator-form';
import placeholderData from '@/lib/placeholder-images.json';
import { Card, CardContent } from '@/components/ui/card';

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
            Tu Entrenador Personal con IA
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto font-body">
            Dinos tus objetivos y nuestra IA creará un plan de entrenamiento único, solo para ti. Tu viaje de fitness, redefinido.
          </p>
        </div>
      </section>

      <section className="container -mt-16 relative z-20 pb-24">
        <div className="max-w-4xl mx-auto">
            <Card>
                <CardContent className="p-6 md:p-8">
                    <WorkoutGeneratorForm />
                </CardContent>
            </Card>
        </div>
      </section>
    </div>
  );
}
