import { NextRequest, NextResponse } from "next/server";
import { verifyAdminCredentials, ADMIN_COOKIE_NAME } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required." },
        { status: 400 }
      );
    }

    const admin = await verifyAdminCredentials(email, password);

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password. Please check your credentials." },
        { status: 401 }
      );
    }

    // Create session payload
    const sessionPayload = {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      authenticatedAt: Date.now(),
    };

    const token = Buffer.from(JSON.stringify(sessionPayload)).toString("base64");

    const response = NextResponse.json({
      success: true,
      message: "Authentication successful! Welcome to Parkash Ceramics Admin Console.",
      user: admin,
    });

    response.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to authenticate" },
      { status: 500 }
    );
  }
}
