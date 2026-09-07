import { CATEGORIES, getCategoryBySlug } from "@/lib/categories";
import { getProducts } from "@/lib/serverDb";
import CategoryDetailClient from "./CategoryDetailClient";
import { notFound } from "next/navigation";

export const dynamicParams = true;
export const dynamic = "force-dynamic";
export const revalidate = 0;

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

  const products = await getProducts({ categorySlug: slug });

  return <CategoryDetailClient category={category} initialProducts={products} />;
}
