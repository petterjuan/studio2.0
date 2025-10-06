'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import placeholderData from '@/lib/placeholder-images.json';
import { ShoppingCart } from 'lucide-react';
import { ShopifyProduct } from '@/lib/definitions';

const productPlaceholder = placeholderData.placeholderImages.find(p => p.id === 'product-1')!;

export default function ProductDetails({ product }: { product: ShopifyProduct }) {
  if (!product) {
    return null;
  }

  return (
    <div className="container py-12 md:py-20">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
        <div className="relative aspect-square bg-muted rounded-lg overflow-hidden shadow-lg">
          <Image
            src={product.imageUrl || productPlaceholder.imageUrl}
            alt={product.title}
            data-ai-hint="product image"
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl md:text-4xl font-headline">{product.title}</h1>
          <p className="text-2xl font-bold text-primary mt-2 mb-4">{product.price}</p>
          <div className="prose dark:prose-invert font-body mb-6">
            <p>{product.description}</p>
          </div>
          <div className="flex items-center gap-4 mb-6">
            {product.tags.map(tag => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
          <Button size="lg" onClick={() => alert('¡Funcionalidad de pago próximamente!')}>
            <ShoppingCart className="mr-2 h-5 w-5" />
            Añadir al Carrito
          </Button>
        </div>
      </div>
    </div>
  );
}
