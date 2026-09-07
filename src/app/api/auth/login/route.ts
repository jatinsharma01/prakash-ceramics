import { NextRequest, NextResponse } from "next/server";
import { findCustomerByEmail } from "@/lib/userDb";
import { USER_COOKIE_NAME, createToken } from "@/lib/userAuth";

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

    const customer = await findCustomerByEmail(email);
    if (!customer) {
      return NextResponse.json(
        { success: false, message: "No account found with this email. Please check your email or register." },
        { status: 401 }
      );
    }

    // Check password
    if (customer.password && customer.password !== password.trim()) {
      return NextResponse.json(
        { success: false, message: "Incorrect password. Please verify and try again." },
        { status: 401 }
      );
    }

    const token = createToken({
      id: customer.id,
      email: customer.email,
      name: customer.name,
      phone: customer.phone,
      tier: customer.tier,
      avatar: customer.avatar,
      authenticatedAt: Date.now(),
    });

    const response = NextResponse.json({
      success: true,
      message: "Signed in successfully! Welcome back.",
      user: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        city: customer.city,
        tier: customer.tier,
        company: customer.company,
        avatar: customer.avatar,
        cart: customer.cart,
        wishlist: customer.wishlist,
      },
    });

    response.cookies.set(USER_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (error: any) {
    console.error("POST /api/auth/login error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to sign in." },
      { status: 500 }
    );
  }
}
