import { NextRequest, NextResponse } from "next/server";
import { getSales, createSale } from "@/lib/serverDb";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active") === "true";

    const sales = await getSales(activeOnly);

    return NextResponse.json({
      success: true,
      sales,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch sales" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.title || !body.bannerText || !body.discountValue) {
      return NextResponse.json(
        { success: false, message: "Title, banner text, and discount value are required." },
        { status: 400 }
      );
    }

    const sale = await createSale(body);

    return NextResponse.json(
      {
        success: true,
        message: "Promotional sale campaign launched successfully!",
        sale,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create promotional sale" },
      { status: 500 }
    );
  }
}
