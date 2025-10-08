import type { Article } from './definitions';

const articles: Article[] = [
    {
        id: '4',
        handle: 'magnesio-para-recuperacion-muscular',
        title: 'Magnesio para la Recuperación Muscular: Cómo Funciona y Cómo Utilizarlo',
        contentHtml: 'El magnesio es un mineral esencial que juega un papel crucial en la función muscular, la recuperación y la producción de energía. Para atletas y personas activas, asegurar una ingesta adecuada de magnesio puede significar una recuperación más rápida, menos calambres y un mejor rendimiento general. En este artículo, exploramos los beneficios del magnesio, las mejores fuentes alimenticias y cómo puedes suplementar de manera efectiva para maximizar tus resultados en el gimnasio.',
        excerpt: 'Descubre por qué el magnesio es el héroe anónimo de la recuperación muscular y cómo puede acelerar tus resultados.',
        imageId: 'blog-magnesium',
        publishedAt: '2024-05-25T10:00:00Z'
    },
    {
        id: '1',
        handle: 'desmitificando-los-macros',
        title: 'Desmitificando los Macros: Tu Guía para una Nutrición Inteligente',
        contentHtml: 'Entender los macronutrientes (proteínas, carbohidratos y grasas) es el primer paso para tomar el control de tu nutrición. No se trata de restringir, sino de balancear. En este artículo, te enseñamos cómo calcular tus macros y ajustarlos a tus metas, ya sea que busques perder grasa, ganar músculo o simplemente mejorar tu energía diaria.',
        excerpt: 'No se trata de restringir, sino de balancear. Aprende a calcular y ajustar tus macronutrientes para alcanzar tus metas de fitness.',
        imageId: 'blog-macros',
        publishedAt: '2024-05-10T10:00:00Z'
    },
    {
        id: '2',
        handle: 'el-poder-del-entrenamiento-de-fuerza',
        title: 'El Poder del Entrenamiento de Fuerza para Mujeres',
        contentHtml: '¡Es hora de dejar de tenerle miedo a las pesas! El entrenamiento de fuerza es una de las herramientas más poderosas para transformar tu cuerpo, acelerar tu metabolismo y construir una confianza inquebrantable. Descubre una rutina de cuerpo completo para principiantes y aprende por qué levantar pesado es el secreto para un físico tonificado y fuerte.',
        excerpt: 'Descubre por qué levantar pesas es clave para un metabolismo acelerado, un cuerpo tonificado y una confianza inquebrantable.',
        imageId: 'blog-strength',
        publishedAt: '2024-05-15T10:00:00Z'
    },
    {
        id: '3',
        handle: 'recuperacion-activa-maximiza-tus-resultados',
        title: 'Recuperación Activa: El Secreto para Maximizar Tus Resultados',
        contentHtml: 'El descanso es tan importante como el entrenamiento. Pero, ¿sabías que la recuperación activa puede acelerar tus resultados? Exploramos técnicas como el foam rolling, los estiramientos dinámicos y el cardio de baja intensidad para reducir el dolor muscular y prepararte para tu próxima sesión, más fuerte que antes.',
        excerpt: 'Tu progreso no solo ocurre en el gimnasio. Aprende técnicas de recuperación activa para reducir el dolor y mejorar tu rendimiento.',
        imageId: 'blog-recovery',
        publishedAt: '2024-05-20T10:00:00Z'
    },
];

export async function getArticles(first?: number): Promise<Article[]> {
  const sortedArticles = articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  if (first) {
    return sortedArticles.slice(0, first);
  }
  return sortedArticles;
}

export async function getArticleByHandle(handle: string): Promise<Article | null> {
    const article = articles.find(a => a.handle === handle);
    return article || null;
}
