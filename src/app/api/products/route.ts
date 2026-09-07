import { NextRequest, NextResponse } from "next/server";
import { getProducts, createProduct } from "@/lib/serverDb";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;
    const search = searchParams.get("search") || undefined;
    const featured = searchParams.get("featured") === "true";
    const bestseller = searchParams.get("bestseller") === "true";
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;

    const products = await getProducts({
      categorySlug: category,
      search,
      featured,
      bestseller,
      limit,
    });

    return NextResponse.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error: any) {
    console.error("GET /api/products error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name || !body.category || !body.price) {
      return NextResponse.json(
        { success: false, message: "Name, category, and price are required fields." },
        { status: 400 }
      );
    }

    const created = await createProduct(body);

    return NextResponse.json(
      {
        success: true,
        message: "Product created and published successfully!",
        product: created,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/products error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create product" },
      { status: 500 }
    );
  }
}
