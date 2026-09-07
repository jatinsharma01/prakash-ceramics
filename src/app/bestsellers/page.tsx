import { getProducts, getPageSeoByPath } from "@/lib/serverDb";
import BestsellersClient from "./BestsellersClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeoByPath("/bestsellers");
  const title = seo?.title || "Best Sellers Collection | PARKASH CERAMICS Luxury Bathware";
  const description =
    seo?.description ||
    "Explore our most loved and customer-favorite faucets, rainfall showers, wellness bathtubs, and sanitaryware pieces.";

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

export default async function BestsellersPage() {
  const products = await getProducts({ bestseller: true });
  return <BestsellersClient initialProducts={products} />;
}
