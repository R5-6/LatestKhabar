"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Eye, PlusCircle, Clock } from "lucide-react";
import { getAllArticles } from "@/lib/articles";
import type { Article } from "@/lib/articles";
import { formatDistanceToNow } from "date-fns";

export default function AdminDashboardPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAllArticles();
        setArticles(data);
      } catch (error) {
        console.error("Failed to fetch articles:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const published = articles.filter((a) => a.status === "published");
  const drafts = articles.filter((a) => a.status === "draft");
  const recentArticles = articles.slice(0, 5);

  const stats = [
    {
      label: "Total Articles",
      value: articles.length,
      icon: FileText,
      color: "text-chart-2",
      bg: "bg-chart-2/10",
    },
    {
      label: "Published",
      value: published.length,
      icon: Eye,
      color: "text-chart-3",
      bg: "bg-chart-3/10",
    },
    {
      label: "Drafts",
      value: drafts.length,
      icon: Clock,
      color: "text-chart-4",
      bg: "bg-chart-4/10",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
        <Link
          href="/admin/articles/new"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <PlusCircle className="h-4 w-4" />
          New Article
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="flex items-center gap-4 rounded-xl border border-border bg-card p-6"
            >
              <div className={`rounded-lg p-3 ${stat.bg}`}>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">
                  {loading ? "-" : stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Articles */}
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h3 className="text-lg font-semibold text-card-foreground">
            Recent Articles
          </h3>
          <Link
            href="/admin/articles"
            className="text-sm text-primary transition-colors hover:text-primary/80"
          >
            View all
          </Link>
        </div>
        <div className="divide-y divide-border">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4">
                <div className="h-4 w-full animate-pulse rounded bg-muted" />
              </div>
            ))
          ) : recentArticles.length > 0 ? (
            recentArticles.map((article) => (
              <Link
                key={article.id}
                href={`/admin/articles/${article.id}`}
                className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-secondary/50"
              >
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-card-foreground">
                    {article.title}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="rounded bg-muted px-1.5 py-0.5">
                      {article.category}
                    </span>
                    <span>{"·"}</span>
                    <span>
                      {formatDistanceToNow(article.createdAt, {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    article.status === "published"
                      ? "bg-chart-3/10 text-chart-3"
                      : "bg-chart-4/10 text-chart-4"
                  }`}
                >
                  {article.status}
                </span>
              </Link>
            ))
          ) : (
            <div className="px-6 py-8 text-center text-sm text-muted-foreground">
              No articles yet. Create your first article to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
