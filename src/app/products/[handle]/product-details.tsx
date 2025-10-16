
'use client';

import Image from 'next/image';
import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Zap, Loader2 } from 'lucide-react';
import { Product } from '@/lib/definitions';
import { useToast } from '@/hooks/use-toast';
import { createCheckoutSession } from '../actions';
import { getPlaceholder } from '@/lib/utils';

const muscleBitesFeatures = [
    "Descubre 4 secretos para combinar snacks de forma inteligente y mantener tu energía.",
    "Potencia tus entrenamientos con 10 recetas pre-entreno deliciosas y fáciles de preparar.",
    "Acelera tu recuperación muscular con 5 recetas post-entreno diseñadas para nutrir tu cuerpo."
];

export default function ProductDetails({ product }: { product: Product }) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  if (!product) {
    return null;
  }

  const handleBuyNow = async () => {
    startTransition(async () => {
      try {
        const response = await createCheckoutSession(product.id);
        
        if (response.url) {
            window.location.href = response.url;
        } else {
            // Now we can show the specific error from the server
            throw new Error(response.error || 'No checkout URL returned');
        }

      } catch (error: any) {
        console.error("Checkout failed:", error);
        toast({
            variant: 'destructive',
            title: '¡Oh, no! Algo salió mal.',
            description: `No se pudo redirigir a la página de pago. Por favor, inténtalo de nuevo. (${error.message})`,
        });
      }
    });
  }

  const image = getPlaceholder(product.imageId);

  return (
    <div className="container py-12 md:py-20">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-start">
        <div className="relative aspect-square bg-muted rounded-lg overflow-hidden shadow-lg">
          <Image
            src={image.imageUrl}
            alt={product.title}
            data-ai-hint={image.imageHint}
            width={600}
            height={600}
            className="object-cover"
            priority
          />
        </div>
        <div className="flex flex-col justify-center">
          <Badge variant="secondary" className="w-fit mb-2">E-Book Exclusivo</Badge>
          <h1 className="text-3xl md:text-4xl font-headline">Transforma tu Nutrición con {product.title}</h1>
          <p className="text-2xl font-bold text-primary mt-2 mb-4">{product.price}</p>
          
          <div className="prose dark:prose-invert font-body mb-6" dangerouslySetInnerHTML={{ __html: product.description }} />
          
           <div className="space-y-3 my-6">
              {muscleBitesFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1 shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                  </div>
              ))}
          </div>

          <Button size="lg" onClick={handleBuyNow} disabled={isPending} className="w-full shadow-lg hover:shadow-primary/50 transition-shadow duration-300">
            {isPending ? (
                <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Redirigiendo...
                </>
            ) : (
                <>
                    <Zap className="mr-2 h-5 w-5" />
                    ¡Lo Quiero Ahora!
                </>
            )}
          </Button>
          <p className="text-xs text-center mt-2 text-muted-foreground">Compra segura con Stripe. Acceso instantáneo.</p>
        </div>
      </div>
    </div>
  );
}
