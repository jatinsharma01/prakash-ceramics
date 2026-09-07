import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/userAuth";
import { updateAddress, deleteAddress } from "@/lib/userDb";

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();

    const updated = await updateAddress(id, currentUser.id, body);
    if (!updated) {
      return NextResponse.json({ success: false, message: "Address not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Address updated successfully.",
      address: updated,
    });
  } catch (error: any) {
    console.error("PUT /api/user/addresses/[id] error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update address" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }

    const { id } = await context.params;
    const deleted = await deleteAddress(id, currentUser.id);

    return NextResponse.json({
      success: true,
      message: "Address removed successfully.",
      deleted,
    });
  } catch (error: any) {
    console.error("DELETE /api/user/addresses/[id] error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete address" },
      { status: 500 }
    );
  }
}
