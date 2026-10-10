import { getBrandByIdOrSlug, getAllBrands, getProducts } from "@/lib/serverDb";
import { INITIAL_BRANDS } from "@/lib/brands";
import BrandDetailClient from "./BrandDetailClient";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamicParams = true;
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateStaticParams() {
  const brands = await getAllBrands();
  return brands.map((b) => ({
    slug: b.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  let brand = await getBrandByIdOrSlug(slug);
  if (!brand) {
    brand = INITIAL_BRANDS.find((b) => b.slug === slug || b.name.toLowerCase() === slug.toLowerCase()) || null;
  }

  if (!brand) {
    return {
      title: "Brand Not Found | Prakash Ceramics",
    };
  }

  return {
    title: `${brand.name} Luxury Architectural Collection | PRAKASH CERAMICS`,
    description:
      brand.description ||
      `Explore official ${brand.name} bathroom fixtures, luxury faucets, sanitaryware and sinks at Prakash Ceramics.`,
  };
}

export default async function BrandPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let brand = await getBrandByIdOrSlug(slug);

  if (!brand) {
    brand = INITIAL_BRANDS.find((b) => b.slug === slug || b.name.toLowerCase() === slug.toLowerCase()) || null;
  }

  if (!brand) {
    notFound();
  }

  const products = await getProducts({ brand: brand.name });

  return <BrandDetailClient brand={brand} initialProducts={products} />;
}
