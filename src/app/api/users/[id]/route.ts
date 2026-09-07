import { NextRequest, NextResponse } from "next/server";
import { updateCustomer, deleteCustomerUser, getCustomerForAdminById } from "@/lib/userDb";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const user = await getCustomerForAdminById(id);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Client account not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error: any) {
    console.error("GET /api/users/[id] error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch user" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const updated = await updateCustomer(id, body);

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "User account updated successfully",
      user: updated,
    });
  } catch (error: any) {
    console.error("PATCH /api/users/[id] error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const deleted = await deleteCustomerUser(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "User account deleted successfully",
    });
  } catch (error: any) {
    console.error("DELETE /api/users/[id] error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete user" },
      { status: 500 }
    );
  }
}
