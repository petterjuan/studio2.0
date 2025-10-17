
import type { Product } from './definitions';

function formatPrice(amount: number, currencyCode: string = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      currencyDisplay: 'narrowSymbol'
    }).format(amount);
}

const products: Product[] = [
    {
        id: 'prod_ebook_muscle_bites',
        handle: 'muscle-bites-snacks',
        title: 'Muscle Bites: Snacks para Ganar Masa Muscular',
        description: 'Tu guía definitiva de snacks altos en proteína. Incluye 10 recetas pre-entrenamiento y 5 post-entrenamiento con macros detallados para alimentar tu cuerpo de forma inteligente y deliciosa. ¡Transforma tu nutrición y alcanza tus metas!',
        rawPrice: 29.00,
        price: formatPrice(29.00),
        imageId: 'product-ebook-muscle-bites',
        stripePriceId: 'price_1PXmGjRsubz5A5s23s5hFz5E',
        tags: ['ebook', 'nutrición', 'snacks']
    },
    {
        id: 'prod_whey_protein',
        handle: 'proteina-whey-vm-signature',
        title: 'Proteína Whey "VM Signature"',
        description: 'Nuestra proteína de suero de leche de la más alta calidad, con un sabor increíble y diseñada para una máxima absorción. El complemento perfecto para tus batidos post-entreno.',
        rawPrice: 65.00,
        price: formatPrice(65.00),
        imageId: 'product-whey-protein',
        stripePriceId: 'price_1PXmHJRsubz5A5s2q7nI3xCa',
        tags: ['suplemento', 'proteína']
    },
    {
        id: 'prod_resistance_bands',
        handle: 'bandas-de-resistencia-vm-pro',
        title: 'Set de Bandas de Resistencia "VM Pro"',
        description: 'Lleva tus entrenamientos de glúteos al siguiente nivel con nuestro set de 3 bandas de resistencia de tela. Perfectas para activar y construir, en casa o en el gimnasio.',
        rawPrice: 25.00,
        price: formatPrice(25.00),
        imageId: 'product-resistance-bands',
        stripePriceId: 'price_1PXmHmRsubz5A5s2zFj2oQp0',
        tags: ['equipamiento', 'fitness']
    },
    {
        id: 'prod_ebook_fasting',
        handle: 'guia-de-ayuno-intermitente',
        title: 'E-Book: Ayuno Intermitente para Mujeres',
        description: 'Descubre cómo implementar el ayuno intermitente de forma segura y efectiva para potenciar la quema de grasa y mejorar tu claridad mental, adaptado al ciclo hormonal femenino.',
        rawPrice: 29.00,
        price: formatPrice(29.00),
        imageId: 'product-intermittent-fasting',
        stripePriceId: 'price_1PXmIARsubz5A5s28p1A5ZlA',
        tags: ['ebook', 'nutrición', 'ayuno']
    },
    {
        id: 'coach_6_weeks',
        handle: 'coaching-6-semanas',
        title: 'Plan de Coaching de 6 Semanas',
        description: 'Transformación intensiva de 6 semanas con seguimiento y planes 100% personalizados.',
        rawPrice: 167.00,
        price: formatPrice(167.00),
        imageId: 'default',
        stripePriceId: 'price_1PXmJDRsubz5A5s2tMExVpC6',
        tags: ['coaching', '6-semanas']
    },
     {
        id: 'coach_12_weeks',
        handle: 'coaching-12-semanas',
        title: 'Plan de Coaching de 12 Semanas',
        description: 'El programa completo de 12 semanas para una transformación total de cuerpo y mente.',
        rawPrice: 267.00,
        price: formatPrice(267.00),
        imageId: 'default',
        stripePriceId: 'price_1PXmJaRsubz5A5s23kVi8K8L',
        tags: ['coaching', '12-semanas']
    }
];


export async function getProducts(first?: number): Promise<Product[]> {
    if (first) {
        return products.slice(0, first);
    }
    return products;
}

export async function getProductByHandle(handle: string): Promise<Product | null> {
    const product = products.find(p => p.handle === handle);
    return product || null;
}

export async function getProductById(id: string): Promise<Product | null> {
    const product = products.find(p => p.id === id);
    return product || null;
}
