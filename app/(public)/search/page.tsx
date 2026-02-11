"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { getPublishedArticles } from "@/lib/articles";
import type { Article } from "@/lib/articles";
import { ArticleCard } from "@/components/article-card";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const data = await getPublishedArticles(100);
        setAllArticles(data);
      } catch (error) {
        console.error("Failed to fetch articles:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setArticles([]);
      return;
    }
    const q = query.toLowerCase();
    const results = allArticles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.author.toLowerCase().includes(q)
    );
    setArticles(results);
  }, [query, allArticles]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold font-serif text-foreground">
        Search
      </h1>

      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search articles..."
          autoFocus
          className="w-full rounded-xl border border-border bg-card py-3 pl-10 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {loading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : query.trim() ? (
        articles.length > 0 ? (
          <div className="flex flex-col divide-y divide-border">
            {articles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                variant="compact"
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="text-lg text-muted-foreground">
              {'No results found for "'}{query}{'"'}
            </p>
          </div>
        )
      ) : (
        <div className="py-16 text-center text-muted-foreground">
          Start typing to search articles.
        </div>
      )}
    </div>
  );
}
