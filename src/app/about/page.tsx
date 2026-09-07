import type { Metadata } from "next";
import { getPageSeoByPath } from "@/lib/serverDb";
import AboutClient from "./AboutClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeoByPath("/about");
  const title = seo?.title || "Our Heritage & Craftsmanship | PRAKASH CERAMICS";
  const description =
    seo?.description ||
    "Over 35 years of engineering excellence, partnering with Swiss and German cartridge makers to craft bespoke luxury bath fittings and wellness sanctuaries.";

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

export default function AboutPage() {
  return <AboutClient />;
}
