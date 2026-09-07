import type { Metadata } from "next";
import { getPageSeoByPath } from "@/lib/serverDb";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeoByPath("/contact");
  const title = seo?.title || "Experience Centre & Architectural Consultations | PARKASH CERAMICS";
  const description =
    seo?.description ||
    "Book a private design consultation or visit our experiential flagship showrooms to explore working hydrotherapy suites and bespoke PVD finishes.";

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

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
