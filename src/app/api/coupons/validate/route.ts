import { NextRequest, NextResponse } from "next/server";
import { validateCoupon } from "@/lib/serverDb";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, cartTotal } = body;

    if (!code) {
      return NextResponse.json(
        { valid: false, message: "Please enter a coupon code" },
        { status: 400 }
      );
    }

    const result = await validateCoupon(code, Number(cartTotal) || 0);

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { valid: false, message: error.message || "Failed to validate coupon" },
      { status: 500 }
    );
  }
}
