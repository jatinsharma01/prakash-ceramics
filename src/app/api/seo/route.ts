import { NextRequest, NextResponse } from "next/server";
import { getAllPageSeos, getPageSeoByPath, upsertPageSeo, deletePageSeo } from "@/lib/serverDb";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get("path");

    if (path) {
      const item = await getPageSeoByPath(path);
      return NextResponse.json({
        success: true,
        seo: item,
      });
    }

    const list = await getAllPageSeos();
    return NextResponse.json({
      success: true,
      count: list.length,
      seos: list,
    });
  } catch (error: any) {
    console.error("GET /api/seo error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch SEO metadata" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path, pageName, title, description, keywords, ogImage } = body;

    if (!path || !title || !description) {
      return NextResponse.json(
        { success: false, message: "Page Path, Meta Title, and Meta Description are required." },
        { status: 400 }
      );
    }

    const saved = await upsertPageSeo(path, {
      pageName,
      title,
      description,
      keywords,
      ogImage,
    });

    return NextResponse.json({
      success: true,
      message: `Meta tags updated for "${saved.pageName || saved.path}"`,
      seo: saved,
    });
  } catch (error: any) {
    console.error("POST /api/seo error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to save SEO metadata" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idOrPath = searchParams.get("id") || searchParams.get("path");

    if (!idOrPath) {
      return NextResponse.json(
        { success: false, message: "ID or Path is required" },
        { status: 400 }
      );
    }

    const deleted = await deletePageSeo(idOrPath);
    return NextResponse.json({
      success: true,
      deleted,
      message: "SEO record removed successfully",
    });
  } catch (error: any) {
    console.error("DELETE /api/seo error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete SEO metadata" },
      { status: 500 }
    );
  }
}
