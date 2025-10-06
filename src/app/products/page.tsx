import Image from 'next/image';
import Link from 'next/link';
import { getProducts } from '@/lib/shopify';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import placeholderData from '@/lib/placeholder-images.json';

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
    <div className="container py-12 md:py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline">Tienda</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          La selección de equipamiento y suplementos de Valentina para ayudarte a alcanzar tus metas.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <Card key={product.id} className="overflow-hidden group">
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
  );
}
