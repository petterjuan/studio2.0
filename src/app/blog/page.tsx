import Image from 'next/image';
import Link from 'next/link';
import { getArticles } from '@/lib/shopify';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import placeholderData from '@/lib/placeholder-images.json';

export const revalidate = 3600; // Revalidate every hour

const blogPlaceholders = [
    placeholderData.placeholderImages.find(p => p.id === 'blog-1')!,
    placeholderData.placeholderImages.find(p => p.id === 'blog-2')!,
    placeholderData.placeholderImages.find(p => p.id === 'blog-3')!,
];

export default async function BlogPage() {
  const articles = await getArticles(12);

  return (
    <div className="container py-12 md:py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline">El Blog de VM Fitness</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Ideas, consejos y motivación de Valentina Montero para impulsar tu viaje de fitness.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article, index) => (
          <Card key={article.id} className="flex flex-col overflow-hidden">
            <Link href={`/blog/${article.handle}`} className="block">
              <div className="relative h-56 w-full">
                <Image
                  src={article.imageUrl || blogPlaceholders[index % 3].imageUrl}
                  alt={article.title}
                  data-ai-hint={blogPlaceholders[index % 3].imageHint}
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
        ))}
      </div>
    </div>
  );
}
