import { Metadata } from "next";
import { getAllBlogPosts } from "@/lib/serverDb";
import BlogsClient from "./BlogsClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Architectural Journal & Luxury Bathroom Insights | PRAKASH CERAMICS",
  description:
    "Explore luxury bathroom architectural trends, PVD finish guides, hydrotherapy engineering, and design inspirations curated by Prakash Ceramics.",
  keywords: [
    "Prakash Ceramics Journal",
    "Luxury bathroom blog",
    "PVD finishes guide",
    "Architectural bathroom trends",
    "Hydrotherapy shower design",
    "Freestanding bathtubs guide",
  ],
  openGraph: {
    title: "Architectural Journal & Luxury Bathroom Insights | PRAKASH CERAMICS",
    description:
      "Explore luxury bathroom architectural trends, PVD finish guides, hydrotherapy engineering, and design inspirations curated by Prakash Ceramics.",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1600",
        width: 1600,
        height: 900,
        alt: "Prakash Ceramics Architectural Journal",
      },
    ],
  },
};

export default async function BlogsPage() {
  const blogs = await getAllBlogPosts({ publishedOnly: true });

  return <BlogsClient initialBlogs={blogs} />;
}
