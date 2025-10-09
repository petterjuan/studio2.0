
import type { Article } from './definitions';

const articles: Article[] = [
    {
        id: '4',
        handle: 'magnesio-para-recuperacion-muscular',
        title: '¿Calambres y Agotamiento? El Magnesio es Tu Arma Secreta para una Recuperación de Élite',
        contentHtml: `
            <p>Si alguna vez has terminado una sesión intensa y has sentido que tus músculos simplemente no se recuperan, o si los calambres nocturnos interrumpen tu descanso, no estás sola. Estos son signos clásicos de que tu cuerpo podría estar pidiendo a gritos un mineral esencial: el <strong>magnesio</strong>.</p>
            
            <h2>¿Qué es el Magnesio y Por Qué es Crucial para Tu Rendimiento?</h2>
            <p>El magnesio es un mineral involucrado en más de 300 reacciones bioquímicas en el cuerpo. Para las mujeres activas, es especialmente vital. Juega un papel clave en:</p>
            <ul>
                <li><strong>La producción de energía (ATP):</strong> Sin magnesio, la energía que necesitas para esa última repetición simplemente no estaría disponible.</li>
                <li><strong>La síntesis de proteínas:</strong> Fundamental para reparar y construir la masa muscular que tanto te esfuerzas por ganar.</li>
                <li><strong>La función muscular y nerviosa:</strong> Ayuda a regular las contracciones musculares, previniendo calambres y espasmos.</li>
                <li><strong>El control del azúcar en sangre y la presión arterial.</strong></li>
            </ul>

            <h2>Señales de que Podrías Necesitar Más Magnesio</h2>
            <p>Tu cuerpo es inteligente y te envía señales. Algunas de las más comunes en personas que entrenan duro incluyen:</p>
            <ul>
                <li>Calambres o espasmos musculares, especialmente en las piernas.</li>
                <li>Fatiga o debilidad general que no se corresponde con tu esfuerzo.</li>
                <li>Dificultad para dormir o insomnio.</li>
                <li>Antojos de azúcar o chocolate (el cacao es rico en magnesio).</li>
            </ul>

            <h2>Cómo Incorporar Más Magnesio en Tu Dieta</h2>
            <p>La suplementación puede ser una opción, pero siempre es mejor empezar por la comida real. Aquí tienes algunas fuentes excelentes de magnesio:</p>
            <ul>
                <li><strong>Verduras de hoja verde:</strong> Espinacas, acelgas.</li>
                <li><strong>Frutos secos y semillas:</strong> Almendras, semillas de calabaza, semillas de chía.</li>
                <li><strong>Legumbres:</strong> Frijoles negros, lentejas.</li>
                <li><strong>Aguacates y plátanos.</strong></li>
                <li><strong>Chocolate negro (¡sí, chocolate!).</strong></li>
            </ul>
            
            <h2>El Siguiente Paso en Tu Viaje de Nutrición</h2>
            <p>Entender el papel del magnesio es solo el comienzo. Una nutrición inteligente es la clave para desbloquear todo tu potencial. Si estás lista para llevar tus resultados al siguiente nivel con recetas deliciosas y planes de snacks que realmente funcionan, mi e-book <strong>"Muscle Bites: Snacks para Ganar Masa Muscular"</strong> es la herramienta perfecta para ti.</p>
            <p>En él, no solo encontrarás recetas ricas en nutrientes esenciales como el magnesio, sino que aprenderás a estructurar tu alimentación para maximizar la energía y acelerar la recuperación. ¡Es hora de dejar de adivinar y empezar a nutrir tu cuerpo de forma inteligente!</p>
        `,
        excerpt: '¿Sufres de calambres o fatiga post-entreno? Descubre cómo el magnesio, un mineral esencial, puede ser el secreto para una recuperación muscular más rápida y un rendimiento superior. Aprende a identificar las señales de deficiencia y a incorporarlo en tu dieta para maximizar tus resultados.',
        imageId: 'blog-magnesium',
        publishedAt: '2024-05-25T10:00:00Z'
    },
    {
        id: '3',
        handle: 'recuperacion-activa-maximiza-tus-resultados',
        title: 'Recuperación Activa: El Secreto para Maximizar Tus Resultados',
        contentHtml: '<p>El descanso es tan importante como el entrenamiento. Pero, ¿sabías que la recuperación activa puede acelerar tus resultados? Exploramos técnicas como el foam rolling, los estiramientos dinámicos y el cardio de baja intensidad para reducir el dolor muscular y prepararte para tu próxima sesión, más fuerte que antes.</p>',
        excerpt: 'Tu progreso no solo ocurre en el gimnasio. Aprende técnicas de recuperación activa para reducir el dolor y mejorar tu rendimiento.',
        imageId: 'blog-recovery',
        publishedAt: '2024-05-20T10:00:00Z'
    },
    {
        id: '2',
        handle: 'el-poder-del-entrenamiento-de-fuerza',
        title: 'El Poder del Entrenamiento de Fuerza para Mujeres',
        contentHtml: '<p>¡Es hora de dejar de tenerle miedo a las pesas! El entrenamiento de fuerza es una de las herramientas más poderosas para transformar tu cuerpo, acelerar tu metabolismo y construir una confianza inquebrantable. Descubre una rutina de cuerpo completo para principiantes y aprende por qué levantar pesado es el secreto para un físico tonificado y fuerte.</p>',
        excerpt: 'Descubre por qué levantar pesas es clave para un metabolismo acelerado, un cuerpo tonificado y una confianza inquebrantable.',
        imageId: 'blog-strength',
        publishedAt: '2024-05-15T10:00:00Z'
    },
    {
        id: '1',
        handle: 'desmitificando-los-macros',
        title: 'Desmitificando los Macros: Tu Guía para una Nutrición Inteligente',
        contentHtml: '<p>Entender los macronutrientes (proteínas, carbohidratos y grasas) es el primer paso para tomar el control de tu nutrición. No se trata de restringir, sino de balancear. En este artículo, te enseñamos cómo calcular tus macros y ajustarlos a tus metas, ya sea que busques perder grasa, ganar músculo o simplemente mejorar tu energía diaria.</p>',
        excerpt: 'No se trata de restringir, sino de balancear. Aprende a calcular y ajustar tus macronutrientes para alcanzar tus metas de fitness.',
        imageId: 'blog-macros',
        publishedAt: '2024-05-10T10:00:00Z'
    }
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
