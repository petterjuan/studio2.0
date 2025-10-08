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
        id: '5',
        handle: 'muscle-bites-snacks',
        title: 'Muscle Bites: Snacks para Ganar Masa Muscular',
        description: 'Tu guía definitiva de snacks altos en proteína. Incluye 10 recetas pre-entrenamiento y 5 post-entrenamiento con macros detallados para alimentar tu cuerpo de forma inteligente y deliciosa. ¡Transforma tu nutrición y alcanza tus metas!',
        rawPrice: 29.00,
        price: formatPrice(29.00),
        imageUrl: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwc25hY2tzJTIwZWJvb2t8ZW58MHx8fHwxNzYwMTgwODU4fDA&ixlib=rb-4.1.0&q=80&w=1080',
        tags: ['ebook', 'nutrición', 'snacks']
    },
    {
        id: '2',
        handle: 'proteina-whey-valentina-montero',
        title: 'Proteína Whey "VM Signature"',
        description: 'Nuestra proteína de suero de leche de la más alta calidad, con un sabor increíble y diseñada para una máxima absorción. El complemento perfecto para tus batidos post-entreno.',
        rawPrice: 65.00,
        price: formatPrice(65.00),
        imageUrl: 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHByb3RlaW4lMjBzaGFrZXxlbnwwfHx8fDE3NjAxODExODZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
        tags: ['suplemento', 'proteína']
    },
    {
        id: '3',
        handle: 'bandas-de-resistencia-vm-pro',
        title: 'Set de Bandas de Resistencia "VM Pro"',
        description: 'Lleva tus entrenamientos de glúteos al siguiente nivel con nuestro set de 3 bandas de resistencia de tela. Perfectas para activar y construir, en casa o en el gimnasio.',
        rawPrice: 25.00,
        price: formatPrice(25.00),
        imageUrl: 'https://images.unsplash.com/photo-1606884690335-b7ab437a3473?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHJlc2lzdGFuY2UlMjBiYW5kc3xlbnwwfHx8fDE3NjAxODEyMjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
        tags: ['equipamiento', 'fitness']
    },
    {
        id: '4',
        handle: 'guia-de-ayuno-intermitente',
        title: 'E-Book: Ayuno Intermitente para Mujeres',
        description: 'Descubre cómo implementar el ayuno intermitente de forma segura y efectiva para potenciar la quema de grasa y mejorar tu claridad mental, adaptado al ciclo hormonal femenino.',
        rawPrice: 29.00,
        price: formatPrice(29.00),
        imageUrl: 'https://images.unsplash.com/photo-1549924231-3b2249c45b87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGZpdG5lc3MlMjBqb3VybmFsfGVufDB8fHx8MTc2MDE4MTI3MXww&ixlib=rb-4.1.0&q=80&w=1080',
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
