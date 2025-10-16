
'use server';

import { Stripe } from 'stripe';
import { headers } from 'next/headers';
import { getPlaceholder } from '@/lib/utils';
import { getProductById } from '@/lib/products';

type CheckoutResponse = {
  url?: string | null;
  error?: string;
}

export async function createCheckoutSession(productId: string): Promise<CheckoutResponse> {
    const headersList = headers();
    const domain = headersList.get('host') || '';
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';

    const product = await getProductById(productId);
    if (!product) {
        return { error: 'Producto no encontrado.' };
    }
    
    const successUrl = `${protocol}://${domain}/muscle-bites.pdf`;
    const cancelUrl = `${protocol}://${domain}/products/${product.handle}`;
    
    if (!process.env.STRIPE_SECRET_KEY) {
        console.log("STRIPE_SECRET_KEY not set. Simulating purchase by returning success URL.");
        // In simulation mode, we just return the success URL directly.
        return { url: successUrl };
    }
    
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2024-06-20',
    });
    
    const image = getPlaceholder(product.imageId);

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: product.title,
                            description: product.description,
                            images: image ? [image.imageUrl] : [],
                        },
                        unit_amount: Math.round(product.rawPrice * 100), // Price in cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: successUrl,
            cancel_url: cancelUrl,
        });

        return { url: session.url };

    } catch (error) {
        console.error("Error creating checkout session:", error);
        return { error: 'Failed to create checkout session.' };
    }
}
