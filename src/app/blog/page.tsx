import Image from 'next/image';
import Link from 'next/link';
import { getArticles } from '@/lib/articles';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { getPlaceholder } from '@/lib/utils';
import { es } from 'date-fns/locale';
import AudioPlayer from './[slug]/audio-player';

export const revalidate = 3600; // Revalidate every hour

export default async function BlogPage() {
  const articles = await getArticles();

  return (
    <>
      <div className="container py-12 md:py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-headline">El Blog de Valentina: Fitness y Bienestar para la Mujer Moderna</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            Este es mi espacio para compartir no solo entrenamientos, sino la mentalidad, la nutrición y la ciencia que necesitas para construir la versión más fuerte y segura de ti misma.
          </p>
        </div>

        {/* Blog Articles */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => {
              const image = getPlaceholder(article.imageId);
              return (
                <Card key={article.id} className="flex flex-col overflow-hidden">
                    <div className="relative aspect-[4/3]">
                        <Link href={`/blog/${article.handle}`} className="block">
                          <Image
                            src={image.imageUrl}
                            alt={article.title}
                            data-ai-hint={image.imageHint}
                            width={1080}
                            height={810}
                            className="object-cover transition-transform duration-300 hover:scale-105"
                          />
                        </Link>
                         <div className="absolute bottom-2 right-2">
                           <AudioPlayer audioDataUri={article.audioDataUri || null} />
                        </div>
                    </div>
                    <CardHeader>
                    <CardTitle as="h2" className="font-headline text-2xl h-16 overflow-hidden">
                        <Link href={`/blog/${article.handle}`} className="hover:text-primary transition-colors">{article.title}</Link>
                    </CardTitle>
                    <CardDescription>{format(new Date(article.publishedAt), 'd MMMM, yyyy', { locale: es })}</CardDescription>
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
    </>
  );
}
