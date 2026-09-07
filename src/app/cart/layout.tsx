import type { Metadata } from "next";
import { getPageSeoByPath } from "@/lib/serverDb";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeoByPath("/cart");
  const title = seo?.title || "Architectural Shortlist & Cart | PARKASH CERAMICS";
  const description =
    seo?.description ||
    "Review your shortlisted luxury bathroom fittings, customized finishes, and request immediate quotations or direct checkout.";

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

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
