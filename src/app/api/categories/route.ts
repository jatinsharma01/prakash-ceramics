import { NextRequest, NextResponse } from "next/server";
import { getAllCategories, createCategory } from "@/lib/serverDb";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const featured = searchParams.get("featured") === "true";

    const categories = await getAllCategories({
      search,
      featured: searchParams.has("featured") ? featured : undefined,
    });

    return NextResponse.json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error: any) {
    console.error("GET /api/categories error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name || typeof body.name !== "string" || !body.name.trim()) {
      return NextResponse.json(
        { success: false, message: "Category name is required." },
        { status: 400 }
      );
    }

    const created = await createCategory(body);

    try {
      revalidatePath("/admin/categories");
      revalidatePath("/admin/products");
      revalidatePath("/admin/products/new");
      revalidatePath("/categories");
      revalidatePath("/products");
      revalidatePath("/");
    } catch (e) {
      console.warn("Revalidation warning:", e);
    }

    return NextResponse.json(
      {
        success: true,
        message: `Category "${created.name}" created successfully.`,
        category: created,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/categories error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create category" },
      { status: 500 }
    );
  }
}
