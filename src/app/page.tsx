import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BrainCircuit, Dumbbell, ShoppingBasket } from 'lucide-react';
import placeholderData from '@/lib/placeholder-images.json';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getArticles, getProducts } from '@/lib/shopify';
import { format } from 'date-fns';

const { placeholderImages } = placeholderData;

function getPlaceholder(id: string) {
  return placeholderImages.find(p => p.id === id) || placeholderImages[0];
}

const heroImage = getPlaceholder('hero-image');
const workoutGenBg = getPlaceholder('workout-generator-bg');

export default async function Home() {
  const latestArticles = await getArticles(3);
  const featuredProducts = await getProducts(4);
  const blogPlaceholders = [getPlaceholder('blog-1'), getPlaceholder('blog-2'), getPlaceholder('blog-3')];
  const productPlaceholders = [getPlaceholder('product-1'), getPlaceholder('product-2'), getPlaceholder('product-3'), getPlaceholder('product-4')];

  return (
    <div className="flex flex-col min-h-dvh">
      <section className="relative w-full h-[60vh] md:h-[80vh] flex items-center justify-center text-center text-white">
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          data-ai-hint={heroImage.imageHint}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 p-4 max-w-4xl">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-headline tracking-tight">
            Transforma tu Cuerpo, Transforma tu Vida
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto font-body">
            Con el coaching personalizado de Valentina Montero y la ayuda de nuestra IA, alcanzarás tus metas de fitness como nunca antes.
          </p>
          <Button asChild size="lg" className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/workout-generator">
              Empieza tu Transformación <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="p-4 bg-primary/20 rounded-full mb-4">
                <BrainCircuit className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-headline mb-2">Entrenador IA</h3>
              <p className="text-muted-foreground">Genera planes de entrenamiento personalizados en segundos, adaptados a tus metas y equipamiento.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-4 bg-primary/20 rounded-full mb-4">
                <Dumbbell className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-headline mb-2">Rutinas Guardadas</h3>
              <p className="text-muted-foreground">Guarda tus rutinas favoritas en tu perfil y accede a ellas en cualquier momento y lugar.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-4 bg-primary/20 rounded-full mb-4">
                <ShoppingBasket className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-headline mb-2">Asistente de Compras</h3>
              <p className="text-muted-foreground">Nuestra IA te ayuda a encontrar los mejores suplementos y equipamiento para tu viaje fitness.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-headline mb-4">Del Blog de Valentina</h2>
          <p className="max-w-2xl mx-auto text-muted-foreground mb-12">Consejos, recetas y motivación para mantenerte en el camino correcto.</p>
          <div className="grid md:grid-cols-3 gap-8">
            {latestArticles.map((article, index) => (
              <Card key={article.id} className="text-left overflow-hidden flex flex-col">
                <Link href={`/blog/${article.handle}`}>
                  <div className="relative h-48 w-full">
                    <Image
                      src={article.imageUrl || blogPlaceholders[index].imageUrl}
                      alt={article.title}
                      data-ai-hint={blogPlaceholders[index].imageHint}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                </Link>
                <CardHeader>
                  <CardTitle className="font-headline text-xl h-14 overflow-hidden">{article.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground line-clamp-3">{article.excerpt}</p>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">{format(new Date(article.publishedAt), 'MMMM d, yyyy')}</span>
                  <Button variant="ghost" asChild>
                    <Link href={`/blog/${article.handle}`}>Leer más <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-16 md:py-24 bg-background">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-headline mb-4">Equípate para el Éxito</h2>
          <p className="max-w-2xl mx-auto text-muted-foreground mb-12">Una selección de productos para potenciar tu rendimiento.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <Card key={product.id} className="overflow-hidden group">
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
            <Link href="/products">Ver todos los productos</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
