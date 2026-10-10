import { NextRequest, NextResponse } from "next/server";
import { getAllBrands, createBrand } from "@/lib/serverDb";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const featured = searchParams.get("featured") === "true";

    const brands = await getAllBrands({
      search,
      featured: searchParams.has("featured") ? featured : undefined,
    });

    return NextResponse.json({
      success: true,
      count: brands.length,
      brands,
    });
  } catch (error: any) {
    console.error("GET /api/brands error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch brands" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name || typeof body.name !== "string" || !body.name.trim()) {
      return NextResponse.json(
        { success: false, message: "Brand name is required." },
        { status: 400 }
      );
    }

    const created = await createBrand(body);

    try {
      revalidatePath("/admin/brands");
      revalidatePath("/admin/products");
      revalidatePath("/admin/products/new");
      revalidatePath("/products");
      revalidatePath("/");
    } catch (e) {
      console.warn("Revalidation warning:", e);
    }

    return NextResponse.json(
      {
        success: true,
        message: `Brand "${created.name}" created successfully.`,
        brand: created,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/brands error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create brand" },
      { status: 500 }
    );
  }
}
