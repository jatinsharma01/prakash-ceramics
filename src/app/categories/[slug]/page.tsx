import { CATEGORIES, getCategoryBySlug } from "@/lib/categories";
import CategoryDetailClient from "./CategoryDetailClient";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return CATEGORIES.map((cat) => ({
    slug: cat.slug,
  }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  return <CategoryDetailClient category={category} />;
}
