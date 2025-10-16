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
        id: '1',
        handle: 'muscle-bites-snacks',
        title: 'Muscle Bites: Snacks para Ganar Masa Muscular',
        description: 'Tu guía definitiva de snacks altos en proteína. Incluye 10 recetas pre-entrenamiento y 5 post-entrenamiento con macros detallados para alimentar tu cuerpo de forma inteligente y deliciosa. ¡Transforma tu nutrición y alcanza tus metas!',
        rawPrice: 29.00,
        price: formatPrice(29.00),
        imageId: 'product-ebook-muscle-bites',
        tags: ['ebook', 'nutrición', 'snacks']
    },
    {
        id: '2',
        handle: 'proteina-whey-jp-signature',
        title: 'Proteína Whey "JP Signature"',
        description: 'Nuestra proteína de suero de leche de la más alta calidad, con un sabor increíble y diseñada para una máxima absorción. El complemento perfecto para tus batidos post-entreno.',
        rawPrice: 65.00,
        price: formatPrice(65.00),
        imageId: 'product-whey-protein',
        tags: ['suplemento', 'proteína']
    },
    {
        id: '3',
        handle: 'bandas-de-resistencia-jp-pro',
        title: 'Set de Bandas de Resistencia "JP Pro"',
        description: 'Lleva tus entrenamientos de glúteos al siguiente nivel con nuestro set de 3 bandas de resistencia de tela. Perfectas para activar y construir, en casa o en el gimnasio.',
        rawPrice: 25.00,
        price: formatPrice(25.00),
        imageId: 'product-resistance-bands',
        tags: ['equipamiento', 'fitness']
    },
    {
        id: '4',
        handle: 'guia-de-ayuno-intermitente',
        title: 'E-Book: Ayuno Intermitente para Mujeres',
        description: 'Descubre cómo implementar el ayuno intermitente de forma segura y efectiva para potenciar la quema de grasa y mejorar tu claridad mental, adaptado al ciclo hormonal femenino.',
        rawPrice: 29.00,
        price: formatPrice(29.00),
        imageId: 'product-intermittent-fasting',
        tags: ['ebook', 'nutrición', 'ayuno']
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
