
'use server';

import { Stripe } from 'stripe';
import { headers } from 'next/headers';
import { getProductById } from '@/lib/products';

type CheckoutResponse = {
  url?: string | null;
  error?: string;
}

export async function createCoachingCheckoutSession(planId: string): Promise<CheckoutResponse> {
    const headersList = headers();
    const domain = headersList.get('host') || '';
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';

    const plan = await getProductById(planId);
    if (!plan) {
        return { error: 'Plan de coaching no encontrado.' };
    }
    
    const successUrl = `${protocol}://${domain}/dashboard?coaching_success=true`;
    const cancelUrl = `${protocol}://${domain}/coaching`;

    if (!process.env.STRIPE_SECRET_KEY || !plan.stripePriceId) {
        console.log("Stripe not configured or plan missing Stripe Price ID. Simulating purchase.");
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
                    price: plan.stripePriceId,
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: successUrl,
            cancel_url: cancelUrl,
        });

        return { url: session.url };

    } catch (error: any) {
        console.error("Error creating coaching checkout session:", error.message);
        return { error: `Failed to create checkout session: ${error.message}` };
    }
}
