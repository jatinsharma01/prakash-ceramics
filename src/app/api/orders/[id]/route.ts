import { NextRequest, NextResponse } from "next/server";
import { updateOrderStatus } from "@/lib/serverDb";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { fulfillmentStatus, paymentStatus, trackingNumber } = body;

    const updated = await updateOrderStatus(id, fulfillmentStatus, paymentStatus, trackingNumber);

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Order updated successfully",
      order: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update order" },
      { status: 500 }
    );
  }
}
