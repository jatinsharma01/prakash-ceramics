import type { Metadata } from "next";
import { getPageSeoByPath } from "@/lib/serverDb";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeoByPath("/wishlist");
  const title = seo?.title || "Saved Curations & Wishlist | PRAKASH CERAMICS";
  const description =
    seo?.description ||
    "Your curated luxury faucets, hydrotherapy showers, and bespoke bathtubs saved for your bathroom and interior planning.";

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

export default function WishlistLayout({ children }: { children: React.ReactNode }) {
  return children;
}
