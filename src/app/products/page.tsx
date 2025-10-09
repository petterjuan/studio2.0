
import Image from 'next/image';
import Link from 'next/link';
import { getProducts } from '@/lib/products';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Zap } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { getPlaceholder } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export const revalidate = 3600; // Revalidate every hour

const TestimonialCarousel = dynamic(
  () => import('@/components/testimonial-carousel'),
  { 
    loading: () => <Skeleton className="h-[250px] w-full" />
  }
);

export default async function ProductsPage() {
  const allProducts = await getProducts();
  const mainProduct = allProducts.find(p => p.handle === 'muscle-bites-snacks');
  const otherProducts = allProducts.filter(p => p.handle !== 'muscle-bites-snacks');

  return (
    <div className="bg-background">
      <section className="bg-gradient-to-b from-background to-secondary/30 py-16 md:py-24">
        <div className="container text-center">
          <Heart className="mx-auto h-12 w-12 text-primary mb-4" />
          <h1 className="text-4xl md:text-5xl font-headline text-foreground">
            Invierte en Ti: Herramientas para Tu Transformación
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            El camino hacia tu mejor versión requiere las herramientas adecuadas. Aquí encontrarás recursos exclusivos, diseñados por Valentina Montero, para nutrir tu cuerpo, fortalecer tu mente y potenciar tus resultados.
          </p>
        </div>
      </section>

      {/* Featured Product: Muscle Bites */}
      {mainProduct && (
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center bg-secondary/50 p-8 rounded-lg shadow-lg">
              <div className="relative aspect-square rounded-lg overflow-hidden">
                <Image
                  src={getPlaceholder(mainProduct.imageId).imageUrl}
                  alt={mainProduct.title}
                  data-ai-hint={getPlaceholder(mainProduct.imageId).imageHint}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col justify-center">
                <h2 className="text-3xl md:text-4xl font-headline">{mainProduct.title}</h2>
                <p className="text-2xl font-bold text-primary mt-2 mb-4">{mainProduct.price}</p>
                <p className="text-muted-foreground mb-6">
                  {mainProduct.description}
                </p>
                <Button size="lg" asChild className="shadow-lg hover:shadow-primary/50 transition-shadow duration-300">
                  <Link href={`/products/${mainProduct.handle}`}>
                    <Zap className="mr-2 h-5 w-5" />
                    ¡Lo Quiero Ahora!
                  </Link>
                </Button>
                 <p className="text-xs text-center mt-2 text-muted-foreground">Compra segura con Stripe. Acceso instantáneo.</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Other Products */}
      {otherProducts.length > 0 && (
         <section className="py-16 md:py-24">
            <div className="container">
                <div className="text-center mb-12">
                     <h3 className="text-3xl font-headline">Explora Otros Recursos</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {otherProducts.map((product) => {
                  const image = getPlaceholder(product.imageId);
                  return (
                    <Card key={product.id} className="overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <Link href={`/products/${product.handle}`}>
                        <CardContent className="p-0">
                        <div className="relative aspect-[4/5] bg-muted">
                            <Image
                            src={image.imageUrl}
                            alt={product.title}
                            data-ai-hint={image.imageHint}
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
                )})}
                </div>
            </div>
         </section>
      )}
      
      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="container text-center">
           <h2 className="text-3xl md:text-4xl font-headline mb-4">Resultados que Inspiran</h2>
            <p className="max-w-2xl mx-auto text-muted-foreground mb-12">
                Descubre cómo estas herramientas han ayudado a otras mujeres a transformar sus vidas y alcanzar sus metas.
            </p>
            <TestimonialCarousel />
        </div>
      </section>
    </div>
  );
}
