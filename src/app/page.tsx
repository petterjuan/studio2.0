
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { getProducts } from '@/lib/products';
import { getArticles } from '@/lib/articles';
import dynamic from 'next/dynamic';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { getPlaceholder } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

const TestimonialCarousel = dynamic(
  () => import('@/components/testimonial-carousel'),
  { 
    loading: () => <Skeleton className="h-[250px] w-full" />
  }
);


export default async function Home() {
  const featuredProducts = await getProducts(4);
  const articles = await getArticles(3);
  const heroImage = getPlaceholder('hero-image');
  const muscleBitesEbookImage = getPlaceholder('product-ebook-muscle-bites');

  const muscleBitesFeatures = [
      "Descubre 4 secretos para combinar snacks de forma inteligente y mantener tu energía.",
      "Potencia tus entrenamientos con 10 recetas pre-entreno deliciosas y fáciles de preparar.",
      "Acelera tu recuperación muscular con 5 recetas post-entreno diseñadas para nutrir tu cuerpo."
  ];

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
            Deja de Adivinar. Transforma Tu Cuerpo con Muscle Bites.
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto font-body">
            La guía definitiva de snacks y recetas para potenciar tus entrenamientos y acelerar tus resultados. Acceso instantáneo a tu plan de nutrición.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/products/muscle-bites-snacks">
              Comprar el Ebook <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
      
      {/* Muscle Bites E-Book Section */}
      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="container">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
                <div className="relative aspect-square bg-muted rounded-lg overflow-hidden shadow-lg order-last md:order-first">
                    <Image
                        src={muscleBitesEbookImage.imageUrl}
                        alt={muscleBitesEbookImage.description}
                        data-ai-hint={muscleBitesEbookImage.imageHint}
                        width={600}
                        height={600}
                        className="object-cover"
                    />
                </div>
                <div className="flex flex-col justify-center">
                    <CardDescription className="font-semibold text-primary">E-BOOK MÁS VENDIDO</CardDescription>
                    <h2 className="text-3xl md:text-4xl font-headline mt-2">Transforma tu Nutrición con Muscle Bites</h2>
                    <p className="text-2xl font-bold text-primary mt-2 mb-4">$29.00</p>
                    <p className="text-muted-foreground mb-6">
                        ¿Lista para dejar de adivinar qué comer? Con este e-book, tendrás el secreto para nutrir tu cuerpo, maximizar tu energía y alcanzar la figura que siempre has deseado. Es más que un libro de recetas, es tu guía para una vida más saludable y fuerte.
                    </p>
                    <div className="space-y-3 my-6">
                        {muscleBitesFeatures.map((feature, index) => (
                            <div key={index} className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-green-500 mt-1 shrink-0" />
                                <span className="text-muted-foreground">{feature}</span>
                            </div>
                        ))}
                    </div>
                     <Button size="lg" asChild className="w-full shadow-lg hover:shadow-primary/50 transition-shadow duration-300">
                        <Link href="/products/muscle-bites-snacks">
                             <Zap className="mr-2 h-5 w-5" />
                            ¡Lo Quiero Ahora!
                        </Link>
                    </Button>
                    <p className="text-xs text-center mt-2 text-muted-foreground">Compra segura con Stripe. Acceso instantáneo.</p>
                </div>
            </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-headline mb-4">Impulsa Tu Grandeza: Nuestros Favoritos</h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              Cada producto está seleccionado por Valentina Montero para potenciar tus resultados y llevarte al siguiente nivel.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.map((product) => {
              const image = getPlaceholder(product.imageId);
              return (
              <Card key={product.id} className="overflow-hidden group text-left">
                 <Link href={`/products/${product.handle}`}>
                  <CardContent className="p-0">
                    <div className="relative aspect-square">
                      <Image
                        src={image.imageUrl}
                        alt={product.title}
                        data-ai-hint={image.imageHint}
                        width={600}
                        height={600}
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  </CardContent>
                  <CardHeader className="p-4">
                    <CardTitle as="h3" className="font-body text-base h-10 overflow-hidden">{product.title}</CardTitle>
                    <p className="font-semibold text-primary">{product.price}</p>
                  </CardHeader>
                </Link>
              </Card>
            )})}
          </div>
          <div className="text-center">
            <Button asChild size="lg" variant="outline" className="mt-12">
              <Link href="/products">Comprar Todos los Productos</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="container text-center">
           <h2 className="text-3xl md:text-4xl font-headline mb-4">Lo que Dicen Nuestras Clientas</h2>
            <p className="max-w-2xl mx-auto text-muted-foreground mb-12">
                Mujeres reales, resultados reales. Ve cómo hemos ayudado a otras a transformar sus vidas.
            </p>
            <TestimonialCarousel />
        </div>
      </section>
      
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-headline mb-4">Del Blog de Fitness de Valentina</h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              Consejos, recetas y motivación para mantenerte en el camino correcto.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {articles.map((article) => {
              const image = getPlaceholder(article.imageId);
              return (
              <Card key={article.id} className="flex flex-col overflow-hidden text-left">
                <Link href={`/blog/${article.handle}`} className="block">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={image.imageUrl}
                      alt={article.title}
                      data-ai-hint={image.imageHint}
                      width={1080}
                      height={720}
                      className="object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                </Link>
                <CardHeader>
                  <CardTitle as="h3" className="font-headline text-xl h-16 overflow-hidden">
                    <Link href={`/blog/${article.handle}`} className="hover:text-primary transition-colors">{article.title}</Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className='pt-0'>
                  <p className="text-sm text-muted-foreground">{format(new Date(article.publishedAt), 'd MMMM, yyyy', { locale: es })}</p>
                  <p className="text-sm text-muted-foreground line-clamp-3 mt-2">{article.excerpt}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="link" asChild className="p-0">
                    <Link href={`/blog/${article.handle}`}>Leer Más <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                </CardFooter>
              </Card>
            )})}
          </div>
        </div>
      </section>
    </div>
  );
}

    