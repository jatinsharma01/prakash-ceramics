import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/userAuth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, user: null }, { status: 401 });
    }

    const { password, ...safeUser } = user;

    return NextResponse.json({
      success: true,
      user: safeUser,
    });
  } catch (error: any) {
    console.error("GET /api/auth/me error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to retrieve session", user: null },
      { status: 500 }
    );
  }
}
