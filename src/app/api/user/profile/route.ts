import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/userAuth";
import { updateCustomer } from "@/lib/userDb";

export async function PATCH(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ success: false, message: "Unauthorized. Please sign in." }, { status: 401 });
    }

    const body = await request.json();
    const updated = await updateCustomer(currentUser.id, {
      name: body.name,
      phone: body.phone,
      city: body.city,
      company: body.company,
      avatar: body.avatar,
    });

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully.",
      user: updated,
    });
  } catch (error: any) {
    console.error("PATCH /api/user/profile error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update profile." },
      { status: 500 }
    );
  }
}
