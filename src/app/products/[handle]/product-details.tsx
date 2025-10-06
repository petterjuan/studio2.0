'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import placeholderData from '@/lib/placeholder-images.json';
import { ShoppingCart, CheckCircle } from 'lucide-react';
import { ShopifyProduct } from '@/lib/definitions';
import { useToast } from '@/hooks/use-toast';

const productPlaceholder = placeholderData.placeholderImages.find(p => p.id === 'product-1')!;

// Mock features for Muscle Bites e-book
const muscleBitesFeatures = [
    "4 Tips para Combinar Snacks Sabiamente",
    "10 Recetas Pre-Entrenamiento",
    "5 Recetas Post-Entrenamiento"
];

export default function ProductDetails({ product }: { product: ShopifyProduct }) {
  const { toast } = useToast();

  if (!product) {
    return null;
  }

  const handleAddToCart = () => {
    toast({
        title: '¡Próximamente!',
        description: 'La funcionalidad de pago con Stripe estará disponible pronto.',
      });
  }

  const isMuscleBites = product.handle === 'muscle-bites';

  return (
    <div className="container py-12 md:py-20">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-start">
        <div className="relative aspect-square bg-muted rounded-lg overflow-hidden shadow-lg">
          <Image
            src={isMuscleBites ? 'https://images.unsplash.com/photo-1543353071-873f6b6a6a89?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxib29rfGVufDB8fHx8MTc2MDM0NTc0Nnww&ixlib=rb-4.1.0&q=80&w=1080' : (product.imageUrl || productPlaceholder.imageUrl)}
            alt={product.title}
            data-ai-hint={isMuscleBites ? "ebook cover" : "product image"}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl md:text-4xl font-headline">{product.title}</h1>
          <p className="text-2xl font-bold text-primary mt-2 mb-4">{product.price}</p>
          
          <div className="prose dark:prose-invert font-body mb-6">
            <p>{isMuscleBites ? "4 Tips para Combinar Snacks + 10 Recetas Pre-Entrenamiento + 5 Recetas Post-Entrenamiento" : product.description}</p>
          </div>
          
          {isMuscleBites && (
             <div className="space-y-3 mb-6">
                {muscleBitesFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-muted-foreground">{feature}</span>
                    </div>
                ))}
            </div>
          )}

          <div className="flex items-center gap-4 mb-6">
            {product.tags.map(tag => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
             {isMuscleBites && <Badge variant="secondary">E-Book</Badge>}
          </div>

          <Button size="lg" onClick={handleAddToCart}>
            <ShoppingCart className="mr-2 h-5 w-5" />
            Añadir al Carrito
          </Button>
        </div>
      </div>
    </div>
  );
}
