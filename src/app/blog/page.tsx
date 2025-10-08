import Image from 'next/image';
import Link from 'next/link';
import { getArticles } from '@/lib/articles';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { getPlaceholder } from '@/lib/utils';

export const revalidate = 3600; // Revalidate every hour

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

export default async function BlogPage() {
  const articles = await getArticles(12);

  return (
    <>
      <div className="container py-12 md:py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-headline">El Diario de Valentina: Conquista Tu Grandeza</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            Este es mi espacio personal para compartir contigo no solo entrenamientos, sino la mentalidad, la nutrición y la motivación que necesitas para construir la versión más fuerte y segura de ti misma.
          </p>
        </div>

        {/* Coaching Section */}
        <section className="py-12 md:py-16 bg-secondary/50 rounded-lg -mx-4 px-4">
            <div className="container">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-headline">Transforma Tu Vida con Mi Coaching Personalizado</h2>
                    <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                        Esto no es solo un plan de fitness, es un compromiso contigo misma. Juntas, crearemos un camino sostenible hacia tus metas, trabajando cuerpo y mente.
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
            </div>
        </section>

        {/* Blog Articles */}
        <div className="mt-16">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article) => {
                  const image = getPlaceholder(article.imageId);
                  return (
                    <Card key={article.id} className="flex flex-col overflow-hidden">
                        <Link href={`/blog/${article.handle}`} className="block">
                        <div className="relative h-56 w-full">
                            <Image
                            src={image.imageUrl}
                            alt={article.title}
                            data-ai-hint={image.imageHint}
                            fill
                            className="object-cover transition-transform duration-300 hover:scale-105"
                            />
                        </div>
                        </Link>
                        <CardHeader>
                        <CardTitle className="font-headline text-2xl h-16 overflow-hidden">
                            <Link href={`/blog/${article.handle}`} className="hover:text-primary transition-colors">{article.title}</Link>
                        </CardTitle>
                        <CardDescription>{format(new Date(article.publishedAt), 'd MMMM, yyyy')}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                        <p className="text-sm text-muted-foreground line-clamp-4">{article.excerpt}</p>
                        </CardContent>
                        <CardFooter>
                        <Button variant="outline" asChild>
                            <Link href={`/blog/${article.handle}`}>Leer Más <ArrowRight className="ml-2 h-4 w-4" /></Link>
                        </Button>
                        </CardFooter>
                    </Card>
                  )
                })}
            </div>
        </div>
      </div>
    </>
  );
}
