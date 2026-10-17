import { NextRequest, NextResponse } from "next/server";
import { getAllBlogPosts, createBlogPost } from "@/lib/serverDb";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const publishedOnly = searchParams.get("publishedOnly") === "true";
    const category = searchParams.get("category") || undefined;
    const search = searchParams.get("search") || undefined;

    const blogs = await getAllBlogPosts({
      publishedOnly,
      category,
      search,
    });

    return NextResponse.json({
      success: true,
      blogs,
      count: blogs.length,
    });
  } catch (error: any) {
    console.error("Failed to fetch blogs:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.title || !body.title.trim()) {
      return NextResponse.json(
        { success: false, message: "Blog title is required" },
        { status: 400 }
      );
    }

    const title = body.title.trim();
    const content = body.content?.trim() || body.description?.trim() || body.excerpt?.trim() || `<p>${title}</p>`;
    const excerpt = body.excerpt?.trim() || body.description?.trim() || (body.content ? body.content.replace(/<[^>]*>?/gm, "").substring(0, 240).trim() : "") || title;

    const created = await createBlogPost({
      title,
      slug: body.slug ? body.slug.trim() : undefined,
      excerpt,
      content,
      coverImage: body.coverImage || null,
      images: Array.isArray(body.images) ? body.images : [],
      category: body.category || "Design & Craft",
      author: body.author || "Prakash Editorial Studio",
      authorRole: body.authorRole || "Senior Design Specialist",
      authorAvatar: body.authorAvatar || null,
      readTime: body.readTime || undefined,
      tags: Array.isArray(body.tags) ? body.tags : [],
      metaTitle: body.metaTitle?.trim() || undefined,
      metaDescription: body.metaDescription?.trim() || undefined,
      keywords: body.keywords?.trim() || null,
      isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : true,
      isFeatured: Boolean(body.isFeatured),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Blog post created successfully",
        blog: created,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Failed to create blog post:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create blog post" },
      { status: 500 }
    );
  }
}
