import { NextRequest, NextResponse } from "next/server";
import { getAllBathroomPackages, createBathroomPackage } from "@/lib/serverDb";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("activeOnly") === "true";
    const search = searchParams.get("search") || undefined;

    const packages = await getAllBathroomPackages({
      activeOnly,
      search,
    });

    return NextResponse.json({
      success: true,
      packages,
      count: packages.length,
    });
  } catch (error: any) {
    console.error("Failed to fetch packages:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch packages" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name || !body.name.trim()) {
      return NextResponse.json(
        { success: false, message: "Package name is required" },
        { status: 400 }
      );
    }

    // Enforce max 8 packages limit
    const existingPackages = await getAllBathroomPackages();
    if (existingPackages.length >= 8) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Maximum limit of 8 bathroom suite packages reached. You can create up to 8 packages max. Please edit or delete an existing suite." 
        },
        { status: 400 }
      );
    }

    // Enforce max 8 items per package
    const items = Array.isArray(body.items) ? body.items : [];
    if (items.length > 8) {
      return NextResponse.json(
        { 
          success: false, 
          message: "A bathroom suite package can contain up to 8 products maximum." 
        },
        { status: 400 }
      );
    }

    const name = body.name.trim();
    const packagePrice = Number(body.packagePrice) || 0;
    const originalPrice = Number(body.originalPrice) || 0;
    const savings = Number(body.savings) || Math.max(0, originalPrice - packagePrice);

    const created = await createBathroomPackage({
      name,
      slug: body.slug ? body.slug.trim() : undefined,
      subtitle: body.subtitle?.trim(),
      badge: body.badge?.trim() || "Curated Suite",
      tagline: body.tagline?.trim(),
      description: body.description?.trim() || "",
      coverImage: body.coverImage?.trim() || "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1200",
      finishTheme: body.finishTheme?.trim() || "Gold Bright PVD",
      idealFor: body.idealFor?.trim() || "Master Bedrooms & Luxury Villas",
      packagePrice,
      originalPrice,
      savings,
      items,
      order: body.order !== undefined ? Number(body.order) : undefined,
      isActive: body.isActive !== undefined ? !!body.isActive : true,
    });

    return NextResponse.json({
      success: true,
      package: created,
      message: "Bathroom suite package created successfully",
    });
  } catch (error: any) {
    console.error("Failed to create package:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create package" },
      { status: 500 }
    );
  }
}
