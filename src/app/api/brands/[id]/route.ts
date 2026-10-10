import { NextRequest, NextResponse } from "next/server";
import { getBrandByIdOrSlug, updateBrand, deleteBrand } from "@/lib/serverDb";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const brand = await getBrandByIdOrSlug(id);

    if (!brand) {
      return NextResponse.json(
        { success: false, message: "Brand not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      brand,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch brand" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const updated = await updateBrand(id, body);

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Brand not found to update" },
        { status: 404 }
      );
    }

    try {
      revalidatePath("/admin/brands");
      revalidatePath("/admin/products");
      revalidatePath("/products");
      revalidatePath("/");
    } catch (e) {
      console.warn("Revalidation warning:", e);
    }

    return NextResponse.json({
      success: true,
      message: `Brand "${updated.name}" updated successfully.`,
      brand: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update brand" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return PUT(request, context);
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const success = await deleteBrand(id);

    if (!success) {
      return NextResponse.json(
        { success: false, message: "Brand not found or already deleted" },
        { status: 404 }
      );
    }

    try {
      revalidatePath("/admin/brands");
      revalidatePath("/admin/products");
      revalidatePath("/products");
      revalidatePath("/");
    } catch (e) {
      console.warn("Revalidation warning:", e);
    }

    return NextResponse.json({
      success: true,
      message: "Brand deleted successfully.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete brand" },
      { status: 500 }
    );
  }
}
