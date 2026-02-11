"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { getArticleBySlug, getArticlesByCategory } from "@/lib/articles";
import type { Article } from "@/lib/articles";
import { ArticleCard } from "@/components/article-card";
import { format } from "date-fns";

export default function ArticlePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [article, setArticle] = useState<Article | null>(null);
  const [related, setRelated] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticle() {
      setLoading(true);
      try {
        const data = await getArticleBySlug(slug);
        setArticle(data);
        if (data) {
          const relatedArticles = await getArticlesByCategory(data.category, 4);
          setRelated(relatedArticles.filter((a) => a.id !== data.id).slice(0, 3));
        }
      } catch (error) {
        console.error("Failed to fetch article:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="flex flex-col gap-6">
          <div className="h-8 w-32 animate-pulse rounded bg-muted" />
          <div className="h-12 w-full animate-pulse rounded bg-muted" />
          <div className="aspect-[16/9] animate-pulse rounded-xl bg-muted" />
          <div className="flex flex-col gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-4 w-full animate-pulse rounded bg-muted" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <h1 className="text-2xl font-bold text-foreground">Article not found</h1>
        <p className="mt-2 text-muted-foreground">
          The article you are looking for does not exist.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-4xl px-4 py-8">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to News
      </Link>

      <header className="mb-8">
        <Link
          href={`/category/${article.category.toLowerCase()}`}
          className="inline-block rounded-md bg-primary/10 px-3 py-1 text-xs font-semibold uppercase text-primary transition-colors hover:bg-primary/20"
        >
          {article.category}
        </Link>

        <h1 className="mt-4 text-3xl font-bold leading-tight font-serif text-foreground md:text-4xl lg:text-5xl text-balance">
          {article.title}
        </h1>

        {article.excerpt && (
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            {article.excerpt}
          </p>
        )}

        <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <User className="h-4 w-4" />
            {article.author}
          </span>
          {article.publishedAt && (
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <time>{format(article.publishedAt, "MMMM d, yyyy")}</time>
            </span>
          )}
        </div>
      </header>

      {article.imageUrl && (
        <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-xl bg-muted">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
            priority
          />
        </div>
      )}

      <div
        className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-foreground prose-p:text-foreground/80 prose-p:leading-relaxed prose-a:text-primary prose-strong:text-foreground"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {/* Related Articles */}
      {related.length > 0 && (
        <section className="mt-16 border-t border-border pt-8">
          <h2 className="mb-6 text-xl font-bold font-serif text-foreground">
            Related Articles
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {related.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
