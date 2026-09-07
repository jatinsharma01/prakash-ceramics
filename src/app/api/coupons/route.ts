import { NextRequest, NextResponse } from "next/server";
import { getCoupons, createCoupon } from "@/lib/serverDb";

export async function GET() {
  try {
    const coupons = await getCoupons();
    return NextResponse.json({
      success: true,
      coupons,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch coupons" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.code || !body.discountType || !body.discountValue || !body.expiryDate) {
      return NextResponse.json(
        { success: false, message: "Code, discount type, discount value, and expiry date are required." },
        { status: 400 }
      );
    }

    const coupon = await createCoupon(body);

    return NextResponse.json(
      {
        success: true,
        message: `Privilege coupon ${coupon.code} created successfully!`,
        coupon,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create coupon" },
      { status: 500 }
    );
  }
}
