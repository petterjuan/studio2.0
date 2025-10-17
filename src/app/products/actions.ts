
'use server';

import { Stripe } from 'stripe';
import { headers } from 'next/headers';
import { getProductById } from '@/lib/products';
import { redirect } from 'next/navigation';

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
    
    // Generic success URL for digital products
    const successUrl = `${protocol}://${domain}/dashboard?purchase_success=true`;
    const cancelUrl = `${protocol}://${domain}/products/${product.handle}`;
    
    if (!process.env.STRIPE_SECRET_KEY || !product.stripePriceId) {
        console.log("Stripe not configured or product missing Stripe Price ID. Simulating purchase.");
        // In simulation mode, we just return the success URL directly.
        return { url: successUrl };
    }
    
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2024-06-20',
    });

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: product.stripePriceId, // Use the Stripe Price ID
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: successUrl,
            cancel_url: cancelUrl,
        });

        return { url: session.url };

    } catch (error: any) {
        console.error("Error creating checkout session:", error.message);
        return { error: `Failed to create checkout session: ${error.message}` };
    }
}
