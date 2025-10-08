import type { Article } from './definitions';

const articles: Article[] = [
    {
        id: '1',
        handle: 'desmitificando-los-macros',
        title: 'Desmitificando los Macros: Tu Guía para una Nutrición Inteligente',
        contentHtml: '<p>Entender los macronutrientes (proteínas, carbohidratos y grasas) es el primer paso para tomar el control de tu nutrición. No se trata de restringir, sino de balancear. En este artículo, te enseñamos cómo calcular tus macros y ajustarlos a tus metas, ya sea que busques perder grasa, ganar músculo o simplemente mejorar tu energía diaria.</p>',
        excerpt: 'No se trata de restringir, sino de balancear. Aprende a calcular y ajustar tus macronutrientes para alcanzar tus metas de fitness.',
        imageUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxtZWFscGxhbnxlbnwwfHx8fDE3NTk3MDExODF8MA&ixlib=rb-4.1.0&q=80&w=1080',
        publishedAt: '2024-05-10T10:00:00Z'
    },
    {
        id: '2',
        handle: 'el-poder-del-entrenamiento-de-fuerza',
        title: 'El Poder del Entrenamiento de Fuerza para Mujeres',
        contentHtml: '<p>¡Es hora de dejar de tenerle miedo a las pesas! El entrenamiento de fuerza es una de las herramientas más poderosas para transformar tu cuerpo, acelerar tu metabolismo y construir una confianza inquebrantable. Descubre una rutina de cuerpo completo para principiantes y aprende por qué levantar pesado es el secreto para un físico tonificado y fuerte.</p>',
        excerpt: 'Descubre por qué levantar pesas es clave para un metabolismo acelerado, un cuerpo tonificado y una confianza inquebrantable.',
        imageUrl: 'https://images.unsplash.com/photo-1581009137042-c552b485697a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxzdHJlbmd0aCUyMHRyYWluaW5nfGVufDB8fHx8MTc1OTcwMTI1NHww&ixlib=rb-4.1.0&q=80&w=1080',
        publishedAt: '2024-05-15T10:00:00Z'
    },
    {
        id: '3',
        handle: 'recuperacion-activa-maximiza-tus-resultados',
        title: 'Recuperación Activa: El Secreto para Maximizar Tus Resultados',
        contentHtml: '<p>El descanso es tan importante como el entrenamiento. Pero, ¿sabías que la recuperación activa puede acelerar tus resultados? Exploramos técnicas como el foam rolling, los estiramientos dinámicos y el cardio de baja intensidad para reducir el dolor muscular y prepararte para tu próxima sesión, más fuerte que antes.</p>',
        excerpt: 'Tu progreso no solo ocurre en el gimnasio. Aprende técnicas de recuperación activa para reducir el dolor y mejorar tu rendimiento.',
        imageUrl: 'https://images.unsplash.com/photo-1607962837339-b615135b2375?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxmb2FtJTIwcm9sbGluZ3xlbnwwfHx8fDE3NTk3MDEzMTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
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
