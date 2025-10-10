import { getProductByHandle, getProducts } from '@/lib/products';
import { notFound } from 'next/navigation';
import dynamicComponent from 'next/dynamic';
import ProductDetails from './product-details';
import { Product } from '@/lib/definitions';
import { Skeleton } from '@/components/ui/skeleton';

export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

const TestimonialCarousel = dynamicComponent(
  () => import('@/components/testimonial-carousel'),
  { 
    loading: () => <Skeleton className="h-[250px] w-full" />
  }
);

export async function generateStaticParams() {
    const products = await getProducts();
    return products.map((product) => ({
      handle: product.handle,
    }));
}

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const product = await getProductByHandle(params.handle);

  if (!product) {
    notFound();
  }

  return (
    <>
      <ProductDetails product={product as Product} />
      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-headline mb-4">No Confíes Solo en Nuestra Palabra</h2>
          <p className="max-w-2xl mx-auto text-muted-foreground mb-12">
            A nuestros clientes les encantan los resultados que obtienen con Muscle Bites.
          </p>
          <TestimonialCarousel />
        </div>
      </section>
    </>
  );
}
