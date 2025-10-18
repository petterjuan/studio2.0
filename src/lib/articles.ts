
'use server';

import { firestore } from '@/firebase/server';
import type { Article } from './definitions';
import { Timestamp } from 'firebase-admin/firestore';

// The original hardcoded articles. We'll insert them if the collection is empty.
const fallbackArticles: Article[] = [
    {
        id: 'fallback-1',
        handle: 'magnesio-para-recuperacion-muscular',
        title: 'Magnesio para la Recuperación Muscular: Cómo Funciona y Cómo Utilizarlo',
        contentHtml: `
            <p>El magnesio (Mg) es un nutriente que tiene muchos beneficios saludables. Uno de los que puede ser más importante para sus clientes es la forma en que apoya la función muscular saludable. Funciona, al bloquear la absorción de calcio. Esto ayuda a que los músculos se relajen mejor después de contraerse durante un entrenamiento intenso.</p>
            <p>Imagínese cómo sería su recuperación del entrenamiento si sus músculos permanecieran contraídos. No sólo sería difícil funcionar en la vida cotidiana, sino que también probablemente sentiría algo de dolor.</p>
            <p>Las investigaciones revelan que tener niveles adecuados de magnesio puede incluso mejorar el rendimiento en el ejercicio. Estas mejoras generalmente se manifiestan a través de una mayor fuerza y potencia. También pueden incluir mejoras relacionadas con la extensión, flexión, rotación y salto.</p>
            <p>Otro beneficio notable del magnesio en la recuperación muscular es el impacto que tiene sobre otros nutrientes. Por ejemplo, el magnesio activa la vitamina D. Los niveles bajos de vitamina D pueden provocar debilidad muscular y dolor. Si estos niveles bajos permanecen, la masa muscular puede disminuir, junto con el rendimiento del atleta.</p>
            <p>De esta manera, tener niveles adecuados de magnesio favorece niveles más saludables de otras vitaminas. Esto asegura que el cuerpo tenga los nutrientes que necesita. Esto mejora aún más la función muscular y la recuperación.</p>

            <h2>Señales de Niveles Bajos de Magnesio</h2>
            <p>¿Cómo puede saber si su nivel de magnesio es lo suficientemente bajo como para que pueda ser un problema? Algunos de los signos más comunes, que van de menos a más graves, incluyen:</p>
            <ul class="list-disc list-inside space-y-2 my-4">
                <li>Apetito reducido</li>
                <li>Náuseas o vómitos</li>
                <li>Fatiga o debilidad general</li>
                <li>Entumecimiento u hormigueo</li>
                <li>Calambres musculares</li>
                <li>Dolor muscular</li>
                <li>Convulsiones</li>
                <li>Arritmia</li>
            </ul>
            <p>En casos graves, la deficiencia de magnesio también puede provocar niveles bajos de otros nutrientes. El calcio y el potasio son dos. Esto altera aún más el equilibrio del cuerpo y puede causar problemas adicionales. El cuerpo no obtiene lo que necesita para funcionar eficazmente.</p>

            <h2>Aumento del Magnesio para Mejorar la Recuperación Muscular</h2>
            <p>Un análisis de sangre puede ayudar a revelar niveles bajos de magnesio. Esto a menudo se denomina prueba de magnesio sérico total. Puede ser parte de un examen físico anual o un médico puede solicitarlo por su cuenta.</p>
            <p>Una vez que se encuentran niveles bajos, la forma más fácil de aumentar el consumo de magnesio es con la dieta. Los alimentos ricos en magnesio incluyen las semillas de calabaza y las espinacas. Los frutos secos como las almendras, los anacardos (este nombre puede variar dependiendo del país) y los cacahuetes también son ricos en este nutriente.</p>

            <h3>Los Mejores Tipos de Magnesio para Aliviar la Tensión Muscular</h3>
            <p>Cuando aprendemos sobre los nutrientes que nuestro cuerpo necesita, a menudo nos hablan del magnesio. Lo que generalmente no nos dicen es que hay muchos tipos diferentes. Esto hace que la cuestión de tomar un suplemento de magnesio sea un poco más compleja. Entonces, ¿cuáles son las opciones disponibles y, de ellas, ¿cuál puede ser mejor para la recuperación muscular? Hay tres.</p>
            <h4>Sulfato de magnesio.</h4>
            <p>Este es el rey del magnesio para la recuperación muscular. De hecho, un estudio informa que incluso detiene la respuesta natural de escalofríos del cuerpo al salir de la anestesia. Así de bien funciona.</p>
            <h4>Cloruro de magnesio.</h4>
            <p>Uno de los beneficios del cloruro de magnesio es que es la forma más fácil de encontrar. Como nota interesante, un estudio del 2008 encontró que el cloruro de magnesio incluso relaja las ostras de roca. (Si alguna vez has intentado pelar ostras, ¡sabes lo fuertes que pueden ser sus contracciones!)</p>
            <h4>Citrato de magnesio.</h4>
            <p>Esta forma de magnesio se digiere más fácilmente. Eso lo hace preferible si sus niveles son bajos debido a problemas de absorción.</p>

            <h2>Consejos para una Suplementación de Magnesio Segura</h2>
            <p>La suplementación de magnesio segura implica seguir algunas guías básicas.</p>
            <p>En primer lugar, manténgase alejado de productos que proporcionen una dosis de magnesio superior a la necesaria. La ODS indica que, al tomar un suplemento de magnesio, no se deben exceder los 350 mg. Tomar más que esto aumenta el riesgo de sufrir diarrea, náuseas y calambres abdominales.</p>
            <p>Además, es más probable que ciertos tipos de magnesio produzcan efectos negativos. Estos son: el carbonato de magnesio, cloruro de magnesio, gluconato de magnesio y óxido de magnesio.</p>
            <p>Si está tomando otros medicamentos, consulte con su médico antes de tomar suplementos de magnesio. Esto ayuda a garantizar que no interfiera con otros tratamientos médicos. Su médico también puede ofrecerle sugerencias sobre la cantidad de magnesio que debe tomar. Esto puede variar según su salud y sus niveles actuales de magnesio.</p>
        `,
        excerpt: '¿Sufres de calambres o fatiga post-entreno? Descubre cómo el magnesio, un mineral esencial, puede ser el secreto para una recuperación muscular más rápida y un rendimiento superior. Aprende a identificar las señales de deficiencia y a incorporarlo en tu dieta para maximizar tus resultados.',
        imageId: 'blog-magnesium',
        publishedAt: '2024-05-25T10:00:00Z',
        audioDataUri: ''
    },
    {
        id: 'fallback-2',
        handle: 'recuperacion-activa-maximiza-tus-resultados',
        title: 'Recuperación Activa: El Secreto para Maximizar Tus Resultados',
        contentHtml: '<p>El descanso es tan importante como el entrenamiento. Pero, ¿sabías que la recuperación activa puede acelerar tus resultados? Exploramos técnicas como el foam rolling, los estiramientos dinámicos y el cardio de baja intensidad para reducir el dolor muscular y prepararte para tu próxima sesión, más fuerte que antes.</p>',
        excerpt: 'Tu progreso no solo ocurre en el gimnasio. Aprende técnicas de recuperación activa para reducir el dolor y mejorar tu rendimiento.',
        imageId: 'blog-recovery',
        publishedAt: '2024-05-20T10:00:00Z',
        audioDataUri: ''
    },
    {
        id: 'fallback-3',
        handle: 'el-poder-del-entrenamiento-de-fuerza',
        title: 'El Poder del Entrenamiento de Fuerza para Mujeres',
        contentHtml: '<p>¡Es hora de dejar de tenerle miedo a las pesas! El entrenamiento de fuerza es una de las herramientas más poderosas para transformar tu cuerpo, acelerar tu metabolismo y construir una confianza inquebrantable. Descubre una rutina de cuerpo completo para principiantes y aprende por qué levantar pesado es el secreto para un físico tonificado y fuerte.</p>',
        excerpt: 'Descubre por qué levantar pesas es clave para un metabolismo acelerado, un cuerpo tonificado y una confianza inquebrantable.',
        imageId: 'blog-strength',
        publishedAt: '2024-05-15T10:00:00Z',
        audioDataUri: ''
    },
    {
        id: 'fallback-4',
        handle: 'desmitificando-los-macros',
        title: 'Desmitificando los Macros: Tu Guía para una Nutrición Inteligente',
        contentHtml: '<p>Entender los macronutrientes (proteínas, carbohidratos y grasas) es el primer paso para tomar el control de tu nutrición. No se trata de restringir, sino de balancear. En este artículo, te enseñamos cómo calcular tus macros y ajustarlos a tus metas, ya sea que busques perder grasa, ganar músculo o simplemente mejorar tu energía diaria.</p>',
        excerpt: 'No se trata de restringir, sino de balancear. Aprende a calcular y ajustar tus macronutrientes para alcanzar tus metas de fitness.',
        imageId: 'blog-macros',
        publishedAt: '2024-05-10T10:00:00Z',
        audioDataUri: ''
    }
].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());


async function fetchArticlesFromFirestore(count?: number): Promise<Article[] | null> {
    try {
        let articlesQuery = firestore.collection('articles').orderBy('publishedAt', 'desc');

        if (count) {
            articlesQuery = articlesQuery.limit(count);
        }

        const snapshot = await articlesQuery.get();
        
        if (snapshot.empty) {
            // Return null if firestore is reachable but has no articles
            // This signals to the calling function to use fallbacks
            return null;
        }
    
        return snapshot.docs.map(doc => {
            const data = doc.data();
            const publishedAt = data.publishedAt;
            return {
                id: doc.id,
                ...data,
                publishedAt: publishedAt instanceof Timestamp ? publishedAt.toDate().toISOString() : publishedAt,
            } as Article;
        });

    } catch (error: any) {
        // This error code (7) indicates "PERMISSION_DENIED", which often happens when Firestore isn't set up
        // or when running in an environment without credentials (like initial local setup).
        if (error.code === 7 || error.code === 'UNAUTHENTICATED' || (error.message && (error.message.includes('Could not refresh access token') || error.message.includes('firestore.googleapis.com')))) {
            console.warn('//////////////////////////////////////////////////////////////////');
            console.warn('// WARNING: Firestore API is not enabled or credentials are missing.');
            console.warn('// The application will proceed using fallback data.');
            console.warn(`// Project: ${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}`);
            console.warn('//////////////////////////////////////////////////////////////////');
            return null; // Return null to indicate fallback is needed
        }
        // For any other error, we should throw it to see what's happening.
        throw error;
    }
}

export async function getArticles(first?: number): Promise<Article[]> {
  const articlesFromDb = await fetchArticlesFromFirestore(first);

  // If Firestore is unreachable or empty, return the hardcoded articles.
  if (articlesFromDb === null) {
      return first ? fallbackArticles.slice(0, first) : fallbackArticles;
  }
  
  // Otherwise, return the articles from the database.
  // Use a Map to ensure uniqueness just in case.
  const uniqueArticles = Array.from(
    new Map(articlesFromDb.map((a) => [a.handle || a.id, a])).values()
  );

  return uniqueArticles;
}

export async function getArticleByHandle(handle: string): Promise<Article | null> {
    try {
        const articlesCollection = firestore.collection('articles');
        const snapshot = await articlesCollection.where('handle', '==', handle).limit(1).get();

        if (snapshot.empty) {
            // Fallback to check seed articles if nothing is found in DB
            return fallbackArticles.find(a => a.handle === handle) || null;
        }
        
        const doc = snapshot.docs[0];
        const data = doc.data();
        const publishedAt = data.publishedAt;
        
        return {
            id: doc.id,
            ...data,
            publishedAt: publishedAt instanceof Timestamp ? publishedAt.toDate().toISOString() : publishedAt,
        } as Article;
    } catch (error: any) {
        if (error.code === 7 || error.code === 'UNAUTHENTICATED' || (error.message && error.message.includes('Could not refresh access token'))) {
             console.warn('// WARNING: Firestore API is not enabled or credentials are missing. Could not fetch article by handle.');
            return fallbackArticles.find(a => a.handle === handle) || null;
        }
        throw error;
    }
}

    