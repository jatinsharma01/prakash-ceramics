import { getProductByIdOrSlug } from "@/lib/serverDb";
import { PRODUCTS } from "@/lib/products";
import ProductDetailClient from "./ProductDetailClient";
import { notFound } from "next/navigation";

import type { Metadata } from "next";

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductByIdOrSlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | PARKASH CERAMICS",
      description: "Explore luxury bathroom fixtures, faucets, showers and bathtubs at Parkash Ceramics.",
    };
  }

  // Meta title and description generated directly from product title and description
  const title = `${product.name} | PARKASH CERAMICS`;
  const description =
    product.description ||
    product.tagline ||
    `Discover ${product.name}, a luxury architectural bath fitting crafted with precision engineering and Swiss cartridges by Parkash Ceramics.`;

  const ogImages = product.images && product.images.length > 0 ? [product.images[0]] : undefined;

  return {
    title,
    description,
    keywords: [
      product.name,
      product.category,
      "Parkash Ceramics",
      "luxury bathroom",
      ...(product.finishes || []),
    ],
    openGraph: {
      title,
      description,
      type: "website",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImages,
    },
  };
}

export async function generateStaticParams() {
  return PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductByIdOrSlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
