import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/lib/articles";
import { formatDistanceToNow } from "date-fns";

interface ArticleCardProps {
  article: Article;
  variant?: "default" | "featured" | "compact";
}

export function ArticleCard({ article, variant = "default" }: ArticleCardProps) {
  const timeAgo = article.publishedAt
    ? formatDistanceToNow(article.publishedAt, { addSuffix: true })
    : "";

  if (variant === "featured") {
    return (
      <Link
        href={`/article/${article.slug}`}
        className="group relative block overflow-hidden rounded-xl"
      >
        <div className="aspect-[16/9] w-full overflow-hidden bg-muted">
          {article.imageUrl ? (
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 70vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
              Latest Khabar
            </div>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <span className="inline-block rounded-md bg-primary px-2.5 py-1 text-xs font-semibold uppercase text-primary-foreground">
            {article.category}
          </span>
          <h2 className="mt-3 text-xl font-bold leading-tight text-background md:text-2xl lg:text-3xl text-balance">
            {article.title}
          </h2>
          <p className="mt-2 line-clamp-2 text-sm text-background/80">
            {article.excerpt}
          </p>
          <div className="mt-3 flex items-center gap-3 text-xs text-background/60">
            <span>{article.author}</span>
            <span aria-hidden="true">{"·"}</span>
            <time>{timeAgo}</time>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link
        href={`/article/${article.slug}`}
        className="group flex gap-4 py-4"
      >
        <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-md bg-muted">
          {article.imageUrl ? (
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="112px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted text-xs text-muted-foreground">
              LK
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center">
          <span className="text-xs font-semibold uppercase text-primary">
            {article.category}
          </span>
          <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
            {article.title}
          </h3>
          <time className="mt-1 text-xs text-muted-foreground">{timeAgo}</time>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/article/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        {article.imageUrl ? (
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
            Latest Khabar
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <span className="text-xs font-semibold uppercase text-primary">
          {article.category}
        </span>
        <h3 className="mt-2 line-clamp-2 text-lg font-bold leading-snug text-card-foreground transition-colors group-hover:text-primary text-pretty">
          {article.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {article.excerpt}
        </p>
        <div className="mt-auto flex items-center gap-3 pt-4 text-xs text-muted-foreground">
          <span>{article.author}</span>
          <span aria-hidden="true">{"·"}</span>
          <time>{timeAgo}</time>
        </div>
      </div>
    </Link>
  );
}
