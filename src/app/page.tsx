
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';
import placeholderData from '@/lib/placeholder-images.json';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { getProducts, getArticles } from '@/lib/shopify';
import TestimonialCarousel from '@/components/testimonial-carousel';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const { placeholderImages } = placeholderData;

function getPlaceholder(id: string) {
  return placeholderImages.find(p => p.id === id) || placeholderImages[0];
}

const heroImage = getPlaceholder('hero-image');

export default async function Home() {
  const featuredProducts = await getProducts(4);
  const productPlaceholders = [getPlaceholder('product-1'), getPlaceholder('product-2'), getPlaceholder('product-3'), getPlaceholder('product-4')];
  const articles = await getArticles(3);
  const blogPlaceholders = [getPlaceholder('blog-1'), getPlaceholder('blog-2'), getPlaceholder('blog-3')];


  return (
    <div className="flex flex-col min-h-dvh">
      <section className="relative w-full h-[70vh] md:h-[90vh] flex items-center justify-center text-center text-white">
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          data-ai-hint={heroImage.imageHint}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
        <div className="relative z-10 p-4 max-w-4xl flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-headline tracking-tight">
            Deja de Adivinar Qué Comer. Transforma Tu Cuerpo con Muscle Bites.
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto font-body">
            Comidas gourmet, altas en proteínas y diseñadas por Valentina Montero para esculpir tu figura ideal. Entregadas frescas en tu puerta.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/products">
              Ver Menú y Planes <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-headline mb-4">Productos Destacados de Muscle Bites</h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              Platillos diseñados por Valentina Montero para potenciar tu rendimiento.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <Card key={product.id} className="overflow-hidden group text-left">
                 <Link href={`/products/${product.handle}`}>
                  <CardContent className="p-0">
                    <div className="relative aspect-square">
                      <Image
                        src={product.imageUrl || productPlaceholders[index].imageUrl}
                        alt={product.title}
                        data-ai-hint={productPlaceholders[index].imageHint}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  </CardContent>
                  <CardHeader className="p-4">
                    <CardTitle className="font-body text-base h-10 overflow-hidden">{product.title}</CardTitle>
                    <p className="font-semibold text-primary">{product.price}</p>
                  </CardHeader>
                </Link>
              </Card>
            ))}
          </div>
          <div className="text-center">
            <Button asChild size="lg" variant="outline" className="mt-12">
              <Link href="/products">Comprar Todos los Productos</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container text-center">
           <h2 className="text-3xl md:text-4xl font-headline mb-4">Lo que Dicen Nuestras Clientes</h2>
            <p className="max-w-2xl mx-auto text-muted-foreground mb-12">
                Personas reales, resultados reales. Ve cómo hemos ayudado a otras a transformar sus vidas.
            </p>
            <TestimonialCarousel />
        </div>
      </section>
      
      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-headline mb-4">Del Blog de Fitness por Valentina</h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              Consejos, recetas y motivación para mantenerte en el camino correcto.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <Card key={article.id} className="flex flex-col overflow-hidden text-left">
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
                  <CardTitle className="font-headline text-xl h-16 overflow-hidden">
                    <Link href={`/blog/${article.handle}`} className="hover:text-primary transition-colors">{article.title}</Link>
                  </CardTitle>
                  <CardDescription>{format(new Date(article.publishedAt), 'd MMMM, yyyy', { locale: es })}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground line-clamp-3">{article.excerpt}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="link" asChild className="p-0">
                    <Link href={`/blog/${article.handle}`}>Leer Más <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
