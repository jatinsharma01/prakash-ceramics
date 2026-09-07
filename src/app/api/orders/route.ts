import { NextRequest, NextResponse } from "next/server";
import { getOrders, createOrder } from "@/lib/serverDb";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || undefined;

    const orders = await getOrders(status);

    return NextResponse.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error: any) {
    console.error("GET /api/orders error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.customer?.fullName || !body.customer?.phone || !body.items?.length) {
      return NextResponse.json(
        { success: false, message: "Customer name, phone, and at least one order item are required." },
        { status: 400 }
      );
    }

    const order = await createOrder(body);

    return NextResponse.json(
      {
        success: true,
        message: "Order placed and recorded successfully!",
        order,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/orders error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}
