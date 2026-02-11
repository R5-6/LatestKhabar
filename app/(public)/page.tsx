"use client";

import { useEffect, useState } from "react";
import { ArticleCard } from "@/components/article-card";
import { getPublishedArticles, getFeaturedArticles, CATEGORIES } from "@/lib/articles";
import type { Article } from "@/lib/articles";
import Link from "next/link";

export default function HomePage() {
  const [featured, setFeatured] = useState<Article[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const [featuredData, allData] = await Promise.all([
          getFeaturedArticles(3),
          getPublishedArticles(20),
        ]);
        setFeatured(featuredData);
        setArticles(allData.filter((a) => !featuredData.some((f) => f.id === a.id)));
      } catch (error) {
        console.error("Failed to fetch articles:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex flex-col gap-8">
          <div className="aspect-[16/9] animate-pulse rounded-xl bg-muted" />
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
        </div>
      </div>
    );
  }

  const heroArticle = featured[0];
  const sideFeatured = featured.slice(1, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Category Bar */}
      <div className="mb-8 flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat}
            href={`/category/${cat.toLowerCase()}`}
            className="shrink-0 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            {cat}
          </Link>
        ))}
      </div>

      {/* Featured Section */}
      {heroArticle && (
        <section className="mb-12">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ArticleCard article={heroArticle} variant="featured" />
            </div>
            <div className="flex flex-col gap-4">
              {sideFeatured.map((article) => (
                <ArticleCard key={article.id} article={article} variant="featured" />
              ))}
              {sideFeatured.length === 0 && articles.length > 0 && (
                <>
                  <ArticleCard article={articles[0]} variant="featured" />
                  {articles[1] && (
                    <ArticleCard article={articles[1]} variant="featured" />
                  )}
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Latest News */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold font-serif text-foreground">
            Latest News
          </h2>
          <div className="h-px flex-1 ml-4 bg-border" />
        </div>
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-lg text-muted-foreground">
              No articles published yet.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Check back soon for the latest news.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
