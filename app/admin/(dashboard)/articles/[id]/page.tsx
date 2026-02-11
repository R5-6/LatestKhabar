"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getArticleById } from "@/lib/articles";
import type { Article } from "@/lib/articles";
import { ArticleForm } from "@/components/admin/article-form";
import { Loader2 } from "lucide-react";

export default function EditArticlePage() {
  const params = useParams();
  const id = params.id as string;
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticle() {
      try {
        const data = await getArticleById(id);
        setArticle(data);
      } catch (error) {
        console.error("Failed to fetch article:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <h2 className="text-xl font-bold text-foreground">Article not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The article you are looking for does not exist.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-foreground">Edit Article</h2>
      <ArticleForm article={article} />
    </div>
  );
}
