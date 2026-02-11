"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PlusCircle, Trash2, Edit, ExternalLink } from "lucide-react";
import { getAllArticles, deleteArticle } from "@/lib/articles";
import type { Article } from "@/lib/articles";
import { format } from "date-fns";

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  async function fetchArticles() {
    try {
      const data = await getAllArticles();
      setArticles(data);
    } catch (error) {
      console.error("Failed to fetch articles:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this article?")) return;
    setDeletingId(id);
    try {
      await deleteArticle(id);
      setArticles((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      console.error("Failed to delete article:", error);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Articles</h2>
        <Link
          href="/admin/articles/new"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <PlusCircle className="h-4 w-4" />
          New Article
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Title
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Category
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Date
                </th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td className="px-4 py-3">
                        <div className="h-4 w-48 animate-pulse rounded bg-muted" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-4 w-16 animate-pulse rounded bg-muted" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                      </td>
                    </tr>
                  ))
                : articles.map((article) => (
                    <tr
                      key={article.id}
                      className="transition-colors hover:bg-secondary/50"
                    >
                      <td className="px-4 py-3">
                        <p className="max-w-xs truncate font-medium text-card-foreground">
                          {article.title}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                          {article.category}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            article.status === "published"
                              ? "bg-chart-3/10 text-chart-3"
                              : "bg-chart-4/10 text-chart-4"
                          }`}
                        >
                          {article.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {format(article.createdAt, "MMM d, yyyy")}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          {article.status === "published" && (
                            <Link
                              href={`/article/${article.slug}`}
                              target="_blank"
                              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                              aria-label="View article"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          )}
                          <Link
                            href={`/admin/articles/${article.id}`}
                            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                            aria-label="Edit article"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(article.id)}
                            disabled={deletingId === article.id}
                            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                            aria-label="Delete article"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
          {!loading && articles.length === 0 && (
            <div className="px-4 py-12 text-center text-sm text-muted-foreground">
              No articles yet. Create your first article to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
