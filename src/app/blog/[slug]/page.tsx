
import { getArticleByHandle, getArticles } from '@/lib/articles';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, User } from 'lucide-react';
import { getPlaceholder } from '@/lib/utils';
import AudioPlayer from './audio-player';
import { generateArticleAudio } from '@/ai/flows/audio-generator';

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((article) => ({
    slug: article.handle,
  }));
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticleByHandle(params.slug);

  if (!article) {
    notFound();
  }
  
  let audioDataUri: string | null = null;
  try {
    const audioData = await generateArticleAudio({ articleTitle: article.title, articleExcerpt: article.excerpt });
    audioDataUri = audioData.media;
  } catch (error) {
    console.warn(`Could not generate audio for article "${article.title}":`, error);
    // Gracefully fail, the page will render without an audio player.
  }

  const image = getPlaceholder(article.imageId);

  return (
    <article>
      <header className="container py-12 md:py-20 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline tracking-tight max-w-4xl mx-auto">
          {article.title}
        </h1>
        <div className="flex items-center justify-center gap-6 mt-6 text-muted-foreground">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="text-sm">Valentina Montero</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <time dateTime={article.publishedAt} className="text-sm">
              {format(new Date(article.publishedAt), 'd MMMM, yyyy', { locale: es })}
            </time>
          </div>
        </div>
      </header>

      <div className="container relative w-full h-[30vh] md:h-[50vh] mb-12">
        <Image
          src={image.imageUrl}
          alt={article.title}
          data-ai-hint={image.imageHint}
          fill
          className="object-cover rounded-lg"
          priority
        />
         <div className="absolute bottom-4 right-4">
            <AudioPlayer audioDataUri={audioDataUri} />
        </div>
      </div>
      
      <div
        className="prose dark:prose-invert lg:prose-xl mx-auto px-4 pb-24 font-body"
        dangerouslySetInnerHTML={{ __html: article.contentHtml }}
      />
    </article>
  );
}
