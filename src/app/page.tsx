import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';
import placeholderData from '@/lib/placeholder-images.json';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getProducts } from '@/lib/shopify';
import TestimonialCarousel from '@/components/testimonial-carousel';

const { placeholderImages } = placeholderData;

function getPlaceholder(id: string) {
  return placeholderImages.find(p => p.id === id) || placeholderImages[0];
}

const heroImage = getPlaceholder('hero-image');

export default async function Home() {
  const featuredProducts = await getProducts(4);
  const productPlaceholders = [getPlaceholder('product-1'), getPlaceholder('product-2'), getPlaceholder('product-3'), getPlaceholder('product-4')];

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
            Fuel Your Greatness with Muscle Bites
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto font-body">
            Gourmet, high-protein meals delivered to your door. The ultimate meal prep solution by Valentina Montero to help you achieve your fitness goals.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/products">
              Explore Meal Plans <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container text-center">
           <h2 className="text-3xl md:text-4xl font-headline mb-4">What Our Clients Say</h2>
            <p className="max-w-2xl mx-auto text-muted-foreground mb-12">
                Real people, real results. See how we've helped others transform their lives.
            </p>
            <TestimonialCarousel />
        </div>
      </section>
      
      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-headline mb-4">Featured Muscle Bites Products</h2>
          <p className="max-w-2xl mx-auto text-muted-foreground mb-12">
            A selection of our most popular meals and supplements to power your performance.
          </p>
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
          <Button asChild size="lg" variant="outline" className="mt-12">
            <Link href="/products">Shop All Products</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
