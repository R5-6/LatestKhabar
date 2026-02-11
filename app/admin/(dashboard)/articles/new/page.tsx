import { ArticleForm } from "@/components/admin/article-form";

export default function NewArticlePage() {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-foreground">New Article</h2>
      <ArticleForm />
    </div>
  );
}
