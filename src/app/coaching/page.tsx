'use client';

import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useTransition, useState } from 'react';
import { CheckCircle, Loader2, Award, ListChecks, Smile, HeartHandshake, BadgePercent, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getPlaceholder } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { createCoachingCheckoutSession } from './actions';
import { FaWhatsapp } from 'react-icons/fa';

const TestimonialCarousel = dynamic(
  () => import('@/components/testimonial-carousel'),
  { 
    loading: () => <Skeleton className="h-[250px] w-full" />
  }
);

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

const howItWorksSteps = [
  {
    icon: ListChecks,
    title: "Paso 1: Elige tu Plan",
    description: "Selecciona el plan de 6 o 12 semanas que mejor se adapte a tu compromiso y tus metas."
  },
  {
    icon: Award,
    title: "Paso 2: Cuestionario Inicial",
    description: "Después de la compra, rellenarás un formulario detallado para que pueda entender tu punto de partida y tus objetivos."
  },
  {
    icon: Smile,
    title: "Paso 3: Recibe tu Plan",
    description: "En 48-72 horas, diseñaré y te enviaré un plan 100% personalizado, creado solo para ti."
  },
  {
    icon: HeartHandshake,
    title: "Paso 4: Comienza la Transformación",
    description: "¡Empezamos a trabajar juntas! Tendrás mi apoyo y seguimiento continuo para asegurar tu éxito."
  },
];

export default function CoachingPage() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [submittingPlan, setSubmittingPlan] = useState<string | null>(null);

  const valentinaImage = getPlaceholder('valentina-coach');
  const whatsappLink = "https://wa.me/15129794797?text=Hola%20Valentina%2C%20tengo%20una%20pregunta%20sobre%20el%20coaching.";

  const handleCheckout = (planId: string) => {
    setSubmittingPlan(planId);
    startTransition(async () => {
      try {
        await createCoachingCheckoutSession(planId);
      } catch (error) {
        console.error("Checkout error:", error);
        toast({
          variant: 'destructive',
          title: '¡Oh, no! Algo salió mal.',
          description: 'No se pudo redirigir a la página de pago. Por favor, inténtalo de nuevo.',
        });
        setSubmittingPlan(null);
      }
    });
  };

  const SubmitButton = ({ planId, children }: { planId: string, children: React.ReactNode }) => {
    const isLoading = isPending && submittingPlan === planId;
    return (
      <Button className="w-full" size="lg" onClick={() => handleCheckout(planId)} disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Redirigiendo...
          </>
        ) : (
          children
        )}
      </Button>
    );
  };


  return (
    <>
      <div className="container py-12 md:py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-headline">Transforma Tu Vida con Mi Coaching Personalizado</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            Esto no es solo un plan de fitness, es un compromiso contigo misma. Juntas, crearemos un camino sostenible hacia tus metas, trabajando cuerpo y mente para construir la versión más fuerte y segura de ti.
          </p>
        </div>

        {/* Meet your Coach */}
        <section className="mb-16 md:mb-24">
            <div className="grid md:grid-cols-5 gap-8 lg:gap-12 items-center bg-muted/30 p-8 rounded-lg">
                <div className="md:col-span-2 relative aspect-[4/5] bg-muted rounded-lg overflow-hidden shadow-lg">
                    <Image
                        src={valentinaImage.imageUrl}
                        alt="Valentina Montero, tu coach de fitness"
                        data-ai-hint={valentinaImage.imageHint}
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="md:col-span-3">
                    <p className="font-semibold text-primary mb-2">CONOCE A TU COACH</p>
                    <h2 className="text-3xl font-headline mb-4">Soy Valentina Montero, y estoy aquí para guiarte</h2>
                    <p className="text-muted-foreground mb-4">
                        Mi misión va más allá de darte una rutina. Se trata de empoderarte con el conocimiento y la confianza para que tomes el control de tu salud. Con años de experiencia ayudando a mujeres a transformar sus vidas, sé lo que se necesita para romper barreras y alcanzar la grandeza.
                    </p>
                     <p className="text-muted-foreground">
                        No creo en soluciones rápidas, creo en un estilo de vida. Juntas, construiremos hábitos que duren para siempre.
                    </p>
                </div>
            </div>
        </section>


        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-start">
          {/* 6-Week Plan */}
          <Card className="flex flex-col">
              <CardHeader>
                  <CardTitle as="h2" className="font-headline text-2xl">Plan de 6 Semanas</CardTitle>
                  <CardDescription as="p" className="text-4xl font-bold text-primary">$167</CardDescription>
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
                  <SubmitButton planId="6-weeks">Empezar Mi Transformación</SubmitButton>
              </CardFooter>
          </Card>

          {/* 12-Week Plan */}
          <Card className="border-primary border-2 flex flex-col relative">
            <div className="absolute top-0 right-0 m-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <Star className="h-3 w-3" /> MÁS POPULAR
            </div>
              <CardHeader>
                  <CardTitle as="h2" className="font-headline text-2xl">Plan de 12 Semanas</CardTitle>
                  <CardDescription as="p" className="text-4xl font-bold text-primary">$267</CardDescription>
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
                  <SubmitButton planId="12-weeks">Empezar Mi Transformación</SubmitButton>
              </CardFooter>
          </Card>
        </div>
      </div>
      
      {/* How it works */}
      <section className="bg-secondary/30 py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-headline">¿Cómo Funciona? Tu Camino Hacia el Éxito</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
              He diseñado un proceso simple y directo para que empieces tu transformación sin complicaciones.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {howItWorksSteps.map((step, index) => (
              <div key={index} className="text-center">
                  <div className="flex items-center justify-center mb-4">
                      <div className="bg-primary text-primary-foreground rounded-full h-16 w-16 flex items-center justify-center">
                          <step.icon className="h-8 w-8" />
                      </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

       {/* Testimonials */}
      <section className="py-16 md:py-24">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-headline mb-4">Resultados que Inspiran</h2>
          <p className="max-w-2xl mx-auto text-muted-foreground mb-12">
            Descubre cómo el coaching ha ayudado a otras mujeres a transformar sus vidas y alcanzar sus metas.
          </p>
          <TestimonialCarousel />
        </div>
      </section>

      <div className="container text-center pb-12 md:pb-16">
        <h3 className="text-2xl font-headline">¿Tienes preguntas antes de empezar?</h3>
        <p className="text-muted-foreground mt-2 mb-4">¡Contáctame directamente! Estaré feliz de ayudarte a decidir si este es el camino correcto para ti.</p>
        <Button asChild size="lg">
          <Link href={whatsappLink} target="_blank">
            <FaWhatsapp className="mr-2 h-5 w-5" />
            Hablemos por WhatsApp
          </Link>
        </Button>
        <div className="mt-4 text-sm text-green-600 font-bold flex items-center justify-center gap-2">
            <BadgePercent className="h-4 w-4" />
            <span>¡Oferta por tiempo limitado! 10% de descuento al mencionar esta página.</span>
        </div>
      </div>
    </>
  );
}
