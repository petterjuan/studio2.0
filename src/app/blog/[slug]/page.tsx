import { getArticleByHandle } from '@/lib/shopify';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import { Calendar, User } from 'lucide-react';
import placeholderData from '@/lib/placeholder-images.json';

const blogPlaceholder = placeholderData.placeholderImages.find(p => p.id === 'blog-1')!;

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticleByHandle(params.slug);

  if (!article) {
    notFound();
  }

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
              {format(new Date(article.publishedAt), 'd MMMM, yyyy')}
            </time>
          </div>
        </div>
      </header>

      <div className="relative w-full h-[30vh] md:h-[50vh] mb-12">
        <Image
          src={article.imageUrl || blogPlaceholder.imageUrl}
          alt={article.title}
          data-ai-hint={blogPlaceholder.imageHint}
          fill
          className="object-cover"
          priority
        />
      </div>
      
      <div
        className="prose dark:prose-invert lg:prose-xl mx-auto px-4 pb-24 font-body"
        dangerouslySetInnerHTML={{ __html: article.contentHtml }}
      />
    </article>
  );
}
