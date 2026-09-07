import { getProducts, getPageSeoByPath } from "@/lib/serverDb";
import ProductsClient from "./ProductsClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeoByPath("/products");
  const title = seo?.title || "Luxury Architectural Bathroom Collections | PARKASH CERAMICS";
  const description =
    seo?.description ||
    "Browse our complete catalogue of precision-engineered Swiss cartridge faucets, rain showers, freestanding tubs, and designer sanitaryware.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: seo?.ogImage ? [seo.ogImage] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: seo?.ogImage ? [seo.ogImage] : undefined,
    },
  };
}

export default async function ProductsPage() {
  const products = await getProducts();
  return <ProductsClient initialProducts={products} />;
}
