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
        handle: 'muscle-bites-e-book',
        title: 'E-Book: La Guía Definitiva de Muscle Bites',
        description: 'Todo lo que necesitas para empezar tu transformación. Este e-book incluye recetas, planes de comida y los secretos de Valentina Montero para un físico de impacto.',
        rawPrice: 47.00,
        price: formatPrice(47.00),
        imageUrl: 'https://images.unsplash.com/photo-1543353071-873f6b6a6a89?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxyZWNpcGUlMjBib29rfGVufDB8fHx8MTc1OTcwMDc2NXww&ixlib=rb-4.1.0&q=80&w=1080',
        tags: ['ebook', 'nutrición']
    },
    {
        id: '2',
        handle: 'proteina-whey-valentina-montero',
        title: 'Proteína Whey "VM Signature"',
        description: 'Nuestra proteína de suero de leche de la más alta calidad, con un sabor increíble y diseñada para una máxima absorción. El complemento perfecto para tus batidos post-entreno.',
        rawPrice: 65.00,
        price: formatPrice(65.00),
        imageUrl: 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxwcm90ZWluJTIwc2hha2V8ZW58MHx8fHwxNzU5NzAwOTYwfDA&ixlib=rb-4.1.0&q=80&w=1080',
        tags: ['suplemento', 'proteína']
    },
    {
        id: '3',
        handle: 'bandas-de-resistencia-vm-pro',
        title: 'Set de Bandas de Resistencia "VM Pro"',
        description: 'Lleva tus entrenamientos de glúteos al siguiente nivel con nuestro set de 3 bandas de resistencia de tela. Perfectas para activar y construir, en casa o en el gimnasio.',
        rawPrice: 25.00,
        price: formatPrice(25.00),
        imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxyZXNpc3RhbmNlJTIwYmFuZHN8ZW58MHx8fHwxNzU5NzAxMDU1fDA&ixlib=rb-4.1.0&q=80&w=1080',
        tags: ['equipamiento', 'fitness']
    },
    {
        id: '4',
        handle: 'guia-de-ayuno-intermitente',
        title: 'E-Book: Ayuno Intermitente para Mujeres',
        description: 'Descubre cómo implementar el ayuno intermitente de forma segura y efectiva para potenciar la quema de grasa y mejorar tu claridad mental, adaptado al ciclo hormonal femenino.',
        rawPrice: 29.00,
        price: formatPrice(29.00),
        imageUrl: 'https://images.unsplash.com/photo-1628211059435-85c6978d4617?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHx3b21hbiUyMGZpdG5lc3MlMjBqb3VybmFsfGVufDB8fHx8MTc1OTcwMTEyN3ww&ixlib=rb-4.1.0&q=80&w=1080',
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
