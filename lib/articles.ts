import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from "firebase/firestore";
import { getFirebaseDb } from "./firebase";

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  imageUrl: string;
  author: string;
  status: "published" | "draft";
  featured: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

function getArticlesRef() {
  return collection(getFirebaseDb(), "articles");
}

function toArticle(docSnap: any): Article {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    title: data.title || "",
    slug: data.slug || "",
    excerpt: data.excerpt || "",
    content: data.content || "",
    category: data.category || "",
    imageUrl: data.imageUrl || "",
    author: data.author || "",
    status: data.status || "draft",
    featured: data.featured || false,
    publishedAt: data.publishedAt?.toDate?.() || null,
    createdAt: data.createdAt?.toDate?.() || new Date(),
    updatedAt: data.updatedAt?.toDate?.() || new Date(),
  };
}

export async function getPublishedArticles(maxCount = 50): Promise<Article[]> {
  const q = query(
    getArticlesRef(),
    where("status", "==", "published"),
    orderBy("publishedAt", "desc"),
    limit(maxCount)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(toArticle);
}

export async function getFeaturedArticles(maxCount = 5): Promise<Article[]> {
  const q = query(
    getArticlesRef(),
    where("status", "==", "published"),
    where("featured", "==", true),
    orderBy("publishedAt", "desc"),
    limit(maxCount)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(toArticle);
}

export async function getArticlesByCategory(
  category: string,
  maxCount = 20
): Promise<Article[]> {
  const q = query(
    getArticlesRef(),
    where("status", "==", "published"),
    where("category", "==", category),
    orderBy("publishedAt", "desc"),
    limit(maxCount)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(toArticle);
}

export async function getArticleBySlug(
  slug: string
): Promise<Article | null> {
  const q = query(getArticlesRef(), where("slug", "==", slug), limit(1));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  return toArticle(snapshot.docs[0]);
}

export async function getArticleById(id: string): Promise<Article | null> {
  const docSnap = await getDoc(doc(getFirebaseDb(), "articles", id));
  if (!docSnap.exists()) return null;
  return toArticle(docSnap);
}

export async function getAllArticles(): Promise<Article[]> {
  const q = query(getArticlesRef(), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(toArticle);
}

export async function createArticle(
  data: Omit<Article, "id" | "createdAt" | "updatedAt">
) {
  const now = Timestamp.now();
  const docRef = await addDoc(getArticlesRef(), {
    ...data,
    publishedAt:
      data.status === "published" && data.publishedAt
        ? Timestamp.fromDate(data.publishedAt)
        : data.status === "published"
        ? now
        : null,
    createdAt: now,
    updatedAt: now,
  });
  return docRef.id;
}

export async function updateArticle(
  id: string,
  data: Partial<Omit<Article, "id" | "createdAt">>
) {
  const updateData: any = {
    ...data,
    updatedAt: Timestamp.now(),
  };
  if (data.publishedAt) {
    updateData.publishedAt = Timestamp.fromDate(data.publishedAt);
  }
  await updateDoc(doc(getFirebaseDb(), "articles", id), updateData);
}

export async function deleteArticle(id: string) {
  await deleteDoc(doc(getFirebaseDb(), "articles", id));
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export const CATEGORIES = [
  "India",
  "World",
  "Politics",
  "Business",
  "Technology",
  "Sports",
  "Entertainment",
  "Health",
] as const;
