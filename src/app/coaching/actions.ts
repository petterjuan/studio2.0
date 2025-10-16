
'use server';

import { Stripe } from 'stripe';
import { headers } from 'next/headers';

type PlanDetails = {
    name: string;
    priceInCents: number;
}

const plans: Record<string, PlanDetails> = {
    '6-weeks': {
        name: 'Plan de Coaching de 6 Semanas',
        priceInCents: 16700,
    },
    '12-weeks': {
        name: 'Plan de Coaching de 12 Semanas',
        priceInCents: 26700,
    }
};

type CheckoutResponse = {
  url?: string | null;
  error?: string;
}

export async function createCoachingCheckoutSession(planId: string): Promise<CheckoutResponse> {
    const headersList = headers();
    const domain = headersList.get('host') || '';
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';

    const plan = plans[planId];
    if (!plan) {
        return { error: 'Plan de coaching no encontrado.' };
    }
    
    const successUrl = `${protocol}://${domain}/dashboard?coaching_success=true`;
    const cancelUrl = `${protocol}://${domain}/coaching`;

    if (!process.env.STRIPE_SECRET_KEY) {
        console.log("STRIPE_SECRET_KEY not set. Simulating purchase by returning success URL.");
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
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: plan.name,
                            description: "Acceso a coaching personalizado con Valentina Montero.",
                            images: [],
                        },
                        unit_amount: plan.priceInCents,
                    },
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
