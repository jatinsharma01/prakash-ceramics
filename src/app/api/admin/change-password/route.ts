import { NextRequest, NextResponse } from "next/server";
import { updateAdminPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, currentPassword, newPassword } = body;

    if (!email || !currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: "Email, current password, and new password are required." },
        { status: 400 }
      );
    }

    const result = await updateAdminPassword(email, currentPassword, newPassword);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update password" },
      { status: 500 }
    );
  }
}
