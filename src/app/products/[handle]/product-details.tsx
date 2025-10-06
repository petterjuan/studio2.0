'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import placeholderData from '@/lib/placeholder-images.json';
import { CheckCircle, Zap } from 'lucide-react';
import { ShopifyProduct } from '@/lib/definitions';
import { useToast } from '@/hooks/use-toast';

const productPlaceholder = placeholderData.placeholderImages.find(p => p.id === 'blog-1')!;

const muscleBitesFeatures = [
    "Descubre 4 secretos para combinar snacks de forma inteligente y mantener tu energía.",
    "Potencia tus entrenamientos con 10 recetas pre-entreno deliciosas y fáciles de preparar.",
    "Acelera tu recuperación muscular con 5 recetas post-entreno diseñadas para nutrir tu cuerpo."
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

  const imageUrl = product.imageUrl || productPlaceholder.imageUrl;
  const imageHint = product.imageUrl ? "product image" : productPlaceholder.imageHint;

  return (
    <div className="container py-12 md:py-20">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-start">
        <div className="relative aspect-square bg-muted rounded-lg overflow-hidden shadow-lg">
          <Image
            src={imageUrl}
            alt={product.title}
            data-ai-hint={imageHint}
            fill
            className="object-cover"
            priority={!product.imageUrl}
          />
        </div>
        <div className="flex flex-col justify-center">
          <Badge variant="secondary" className="w-fit mb-2">E-Book Exclusivo</Badge>
          <h1 className="text-3xl md:text-4xl font-headline">Transforma tu Nutrición con {product.title}</h1>
          <p className="text-2xl font-bold text-primary mt-2 mb-4">{product.price}</p>
          
          <div className="prose dark:prose-invert font-body mb-6">
            <p>¿Lista para dejar de adivinar qué comer? Con este e-book, tendrás el secreto para nutrir tu cuerpo, maximizar tu energía y alcanzar la figura que siempre has deseado. Es más que un libro de recetas, es tu guía para una vida más saludable y fuerte.</p>
          </div>
          
           <div className="space-y-3 my-6">
              {muscleBitesFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1 shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                  </div>
              ))}
          </div>

          <Button size="lg" onClick={handleAddToCart} className="w-full shadow-lg hover:shadow-primary/50 transition-shadow duration-300">
            <Zap className="mr-2 h-5 w-5" />
            ¡Lo Quiero Ahora!
          </Button>
          <p className="text-xs text-center mt-2 text-muted-foreground">Compra segura. Acceso instantáneo.</p>
        </div>
      </div>
    </div>
  );
}
