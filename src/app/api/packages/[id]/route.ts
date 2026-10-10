import { NextRequest, NextResponse } from "next/server";
import { 
  getBathroomPackageByIdOrSlug, 
  updateBathroomPackage, 
  deleteBathroomPackage 
} from "@/lib/serverDb";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const pkg = await getBathroomPackageByIdOrSlug(id);

    if (!pkg) {
      return NextResponse.json(
        { success: false, message: "Package not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      package: pkg,
    });
  } catch (error: any) {
    console.error("Failed to fetch package:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch package" },
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

    const existing = await getBathroomPackageByIdOrSlug(id);
    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Package not found" },
        { status: 404 }
      );
    }

    // Enforce max 8 items per package
    if (Array.isArray(body.items) && body.items.length > 8) {
      return NextResponse.json(
        { 
          success: false, 
          message: "A bathroom suite package can contain up to 8 products maximum." 
        },
        { status: 400 }
      );
    }

    const packagePrice = body.packagePrice !== undefined ? Number(body.packagePrice) : undefined;
    const originalPrice = body.originalPrice !== undefined ? Number(body.originalPrice) : undefined;
    const savings = body.savings !== undefined ? Number(body.savings) : (
      packagePrice !== undefined && originalPrice !== undefined ? Math.max(0, originalPrice - packagePrice) : undefined
    );

    const updated = await updateBathroomPackage(existing.id, {
      name: body.name !== undefined ? body.name.trim() : undefined,
      slug: body.slug !== undefined ? body.slug.trim() : undefined,
      subtitle: body.subtitle !== undefined ? body.subtitle?.trim() : undefined,
      badge: body.badge !== undefined ? body.badge?.trim() : undefined,
      tagline: body.tagline !== undefined ? body.tagline?.trim() : undefined,
      description: body.description !== undefined ? body.description?.trim() : undefined,
      coverImage: body.coverImage !== undefined ? body.coverImage?.trim() : undefined,
      finishTheme: body.finishTheme !== undefined ? body.finishTheme?.trim() : undefined,
      idealFor: body.idealFor !== undefined ? body.idealFor?.trim() : undefined,
      packagePrice,
      originalPrice,
      savings,
      items: Array.isArray(body.items) ? body.items : undefined,
      order: body.order !== undefined ? Number(body.order) : undefined,
      isActive: body.isActive !== undefined ? !!body.isActive : undefined,
    });

    return NextResponse.json({
      success: true,
      package: updated,
      message: "Package updated successfully",
    });
  } catch (error: any) {
    console.error("Failed to update package:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update package" },
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
    const existing = await getBathroomPackageByIdOrSlug(id);

    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Package not found" },
        { status: 404 }
      );
    }

    const deleted = await deleteBathroomPackage(existing.id);

    return NextResponse.json({
      success: deleted,
      message: "Package deleted successfully",
    });
  } catch (error: any) {
    console.error("Failed to delete package:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete package" },
      { status: 500 }
    );
  }
}
