import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPostBySlugOrId, getAllBlogPosts, incrementBlogViews } from "@/lib/serverDb";
import BlogDetailClient from "./BlogDetailClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogPostBySlugOrId(slug);

  if (!blog) {
    return {
      title: "Article Not Found | PRAKASH CERAMICS",
      description: "Discover luxury bathware articles and design guides at Prakash Ceramics.",
    };
  }

  const title = blog.metaTitle || `${blog.title} | PRAKASH CERAMICS`;
  const description =
    blog.metaDescription ||
    blog.excerpt ||
    `Read ${blog.title} on Prakash Ceramics design journal.`;

  const ogImages = blog.coverImage
    ? [
        {
          url: blog.coverImage,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ]
    : undefined;

  return {
    title,
    description,
    keywords: [
      blog.title,
      blog.category,
      "Prakash Ceramics",
      "luxury bathroom",
      ...(blog.tags || []),
    ],
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: new Date(blog.publishedAt).toISOString(),
      authors: [blog.author],
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: blog.coverImage ? [blog.coverImage] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await getBlogPostBySlugOrId(slug);

  if (!blog) {
    notFound();
  }

  // Increment view counter
  incrementBlogViews(blog.id);

  // Fetch related articles
  const allBlogs = await getAllBlogPosts({ publishedOnly: true });
  const relatedBlogs = allBlogs
    .filter((b) => b.id !== blog.id)
    .sort((a, b) => {
      // Prioritize same category
      if (a.category === blog.category && b.category !== blog.category) return -1;
      if (a.category !== blog.category && b.category === blog.category) return 1;
      return 0;
    })
    .slice(0, 3);

  return <BlogDetailClient blog={blog} relatedBlogs={relatedBlogs} />;
}
