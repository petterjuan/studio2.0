import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const coachingFeatures = {
  common: [
    "Plan de entrenamiento 100% personalizado",
    "Seguimiento quincenal para evaluar progreso y hacer ajustes",
    "Plan de alimentación flexible (macros)",
    "Acceso a preguntas 24/7 vía chat",
    "Enfoque en mentalidad, disciplina y confianza",
  ],
  twelveWeek: [
    "Mini Guía de Suplementos y Vitaminas",
  ]
};

export default function CoachingPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline">Transforma Tu Vida con Mi Coaching Personalizado</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
          Esto no es solo un plan de fitness, es un compromiso contigo misma. Juntas, crearemos un camino sostenible hacia tus metas, trabajando cuerpo y mente para construir la versión más fuerte y segura de ti.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-start">
        {/* 6-Week Plan */}
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Plan de 6 Semanas</CardTitle>
                <CardDescription className="text-4xl font-bold text-primary">$167</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
               {coachingFeatures.common.map((feature, i) => (
                 <div key={i} className="flex items-start gap-3">
                   <CheckCircle className="h-5 w-5 text-green-500 mt-1 shrink-0" />
                   <span className="text-sm text-muted-foreground">{feature}</span>
                 </div>
               ))}
            </CardContent>
            <CardFooter>
                <Button className="w-full" size="lg">Empezar Mi Transformación</Button>
            </CardFooter>
        </Card>

        {/* 12-Week Plan */}
        <Card className="border-primary border-2 flex flex-col relative">
             <div className="absolute top-0 right-0 m-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">MÁS POPULAR</div>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Plan de 12 Semanas</CardTitle>
                <CardDescription className="text-4xl font-bold text-primary">$267</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
               {[...coachingFeatures.common, ...coachingFeatures.twelveWeek].map((feature, i) => (
                 <div key={i} className="flex items-start gap-3">
                   <CheckCircle className="h-5 w-5 text-green-500 mt-1 shrink-0" />
                   <span className="text-sm text-muted-foreground">{feature}</span>
                 </div>
               ))}
            </CardContent>
            <CardFooter>
                <Button className="w-full" size="lg">Empezar Mi Transformación</Button>
            </CardFooter>
        </Card>
      </div>
       <div className="text-center mt-16">
          <p className="text-muted-foreground">¿Tienes preguntas antes de empezar? No dudes en contactarme.</p>
          <Button variant="link" asChild>
            <Link href="/#contact">Hablemos</Link>
          </Button>
        </div>
    </div>
  );
}
