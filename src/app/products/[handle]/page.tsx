import { getProductByHandle, getAllProductHandles } from '@/lib/shopify';
import { notFound } from 'next/navigation';
import TestimonialCarousel from '@/components/testimonial-carousel';
import ProductDetails from './product-details';
import { ShopifyProduct } from '@/lib/definitions';


export async function generateStaticParams() {
  const handles = await getAllProductHandles();
  return handles.map((handle) => ({
    handle,
  }));
}

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const product = await getProductByHandle(params.handle);

  if (!product) {
    notFound();
  }

  return (
    <>
      <ProductDetails product={product as ShopifyProduct} />
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
