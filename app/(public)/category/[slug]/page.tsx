"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getArticlesByCategory, CATEGORIES } from "@/lib/articles";
import type { Article } from "@/lib/articles";
import { ArticleCard } from "@/components/article-card";

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const category = CATEGORIES.find(
    (c) => c.toLowerCase() === slug.toLowerCase()
  );
  const categoryName = category || slug.charAt(0).toUpperCase() + slug.slice(1);

  useEffect(() => {
    async function fetchArticles() {
      setLoading(true);
      try {
        const data = await getArticlesByCategory(categoryName, 30);
        setArticles(data);
      } catch (error) {
        console.error("Failed to fetch articles:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, [categoryName]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold font-serif text-foreground md:text-4xl">
          {categoryName}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {'Latest news and updates in '}{categoryName.toLowerCase()}{'.'}
        </p>
      </div>

      {/* Category Navigation */}
      <div className="mb-8 flex items-center gap-3 overflow-x-auto pb-2">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat}
            href={`/category/${cat.toLowerCase()}`}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              cat.toLowerCase() === slug.toLowerCase()
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-card text-muted-foreground hover:border-primary hover:text-primary"
            }`}
          >
            {cat}
          </Link>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <div className="aspect-[16/10] animate-pulse rounded-xl bg-muted" />
              <div className="h-4 w-16 animate-pulse rounded bg-muted" />
              <div className="h-6 w-full animate-pulse rounded bg-muted" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      ) : articles.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-lg text-muted-foreground">
            {'No articles in '}{categoryName}{' yet.'}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Check back soon for the latest updates.
          </p>
        </div>
      )}
    </div>
  );
}
