
'use server';

import { Stripe } from 'stripe';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

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

export async function createCoachingCheckoutSession(planId: string) {
    const headersList = headers();
    const domain = headersList.get('host') || '';
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';

    const plan = plans[planId];
    if (!plan) {
        throw new Error('Plan de coaching no encontrado.');
    }
    
    // Redirect to the dashboard on successful "purchase"
    const successUrl = `${protocol}://${domain}/dashboard?coaching_success=true`;
    const cancelUrl = `${protocol}://${domain}/coaching`;

    if (!process.env.STRIPE_SECRET_KEY) {
        console.log("STRIPE_SECRET_KEY not set. Simulating purchase and redirecting to success URL.");
        redirect(successUrl);
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
