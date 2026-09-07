import { NextRequest, NextResponse } from "next/server";
import { toggleSaleStatus, deleteSale } from "@/lib/serverDb";

export async function PATCH(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const updated = await toggleSaleStatus(id);

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Sale campaign not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Sale status updated",
      sale: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update sale status" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const deleted = await deleteSale(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Sale campaign not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Sale campaign removed successfully",
      sale: deleted,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete sale" },
      { status: 500 }
    );
  }
}
