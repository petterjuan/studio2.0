
'use server';

import { Stripe } from 'stripe';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import type { Product } from '@/lib/definitions';

export async function createCheckoutSession(product: Product) {
    if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error('STRIPE_SECRET_KEY is not set');
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2024-06-20',
    });

    const headersList = headers();
    const domain = headersList.get('host') || '';
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    
    // The success URL now points directly to the PDF file in the public folder.
    // Make sure your PDF is named 'muscle-bites-ebook.pdf' and placed in the /public directory.
    const successUrl = `${protocol}://${domain}/muscle-bites-ebook.pdf`;
    const cancelUrl = `${protocol}://${domain}/products/${product.handle}`;
    
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
                            images: [product.imageUrl],
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

        if (session.url) {
            redirect(session.url);
        } else {
            throw new Error('Could not create Stripe Checkout session.');
        }

    } catch (error) {
        console.error("Error creating checkout session:", error);
        throw new Error('Failed to create checkout session.');
    }
}
