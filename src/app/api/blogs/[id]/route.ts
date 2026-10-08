import { NextRequest, NextResponse } from "next/server";
import { getBlogPostBySlugOrId, updateBlogPost, deleteBlogPost, incrementBlogViews } from "@/lib/serverDb";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const blog = await getBlogPostBySlugOrId(id);

    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog post not found" },
        { status: 404 }
      );
    }

    // Optionally increment view count
    const { searchParams } = new URL(request.url);
    if (searchParams.get("incView") === "true") {
      incrementBlogViews(id);
    }

    return NextResponse.json({
      success: true,
      blog,
    });
  } catch (error: any) {
    console.error("Failed to fetch blog post:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch blog post" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await getBlogPostBySlugOrId(id);
    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Blog post not found" },
        { status: 404 }
      );
    }

    const updated = await updateBlogPost(existing.id, body);

    return NextResponse.json({
      success: true,
      message: "Blog post updated successfully",
      blog: updated,
    });
  } catch (error: any) {
    console.error("Failed to update blog post:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update blog post" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await getBlogPostBySlugOrId(id);

    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Blog post not found" },
        { status: 404 }
      );
    }

    const success = await deleteBlogPost(existing.id);

    return NextResponse.json({
      success,
      message: success ? "Blog post deleted successfully" : "Failed to delete blog post",
    });
  } catch (error: any) {
    console.error("Failed to delete blog post:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete blog post" },
      { status: 500 }
    );
  }
}
