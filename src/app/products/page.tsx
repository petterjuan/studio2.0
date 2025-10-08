import Image from 'next/image';
import Link from 'next/link';
import { getProducts } from '@/lib/shopify';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import placeholderData from '@/lib/placeholder-images.json';
import { Heart } from 'lucide-react';

export const revalidate = 3600; // Revalidate every hour

const productPlaceholders = [
    placeholderData.placeholderImages.find(p => p.id === 'product-1')!,
    placeholderData.placeholderImages.find(p => p.id === 'product-2')!,
    placeholderData.placeholderImages.find(p => p.id === 'product-3')!,
    placeholderData.placeholderImages.find(p => p.id === 'product-4')!,
];

export default async function ProductsPage() {
  const products = await getProducts(20);

  return (
    <div className="bg-gradient-to-b from-background to-secondary/30">
      <div className="container py-12 md:py-16">
        <div className="text-center mb-12 md:mb-16">
          <Heart className="mx-auto h-12 w-12 text-primary mb-4" />
          <h1 className="text-4xl md:text-5xl font-headline text-foreground">
            Productos para Tu Bienestar
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            Despierta tu poder interior con nuestra colección exclusiva de productos. Cada artículo ha sido seleccionado por Valentina Montero y está diseñado para nutrir tu cuerpo, mente y espíritu en tu viaje hacia el bienestar.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <Card key={product.id} className="overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <Link href={`/products/${product.handle}`}>
                <CardContent className="p-0">
                  <div className="relative aspect-square bg-muted">
                    <Image
                      src={product.imageUrl || productPlaceholders[index % 4].imageUrl}
                      alt={product.title}
                      data-ai-hint={productPlaceholders[index % 4].imageHint}
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
      </div>
    </div>
  );
}
