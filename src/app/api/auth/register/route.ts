import { NextRequest, NextResponse } from "next/server";
import { findCustomerByEmail, createCustomer } from "@/lib/userDb";
import { USER_COOKIE_NAME, createToken } from "@/lib/userAuth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, password, city, company, tier } = body;

    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        { success: false, message: "Name, email, phone number, and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const existingUser = await findCustomerByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "An account with this email address already exists. Please sign in." },
        { status: 409 }
      );
    }

    const newUser = await createCustomer({
      name,
      email,
      phone,
      password,
      city,
      company,
      tier: tier || "Privilege Client",
    });

    const token = createToken({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      phone: newUser.phone,
      tier: newUser.tier,
      avatar: newUser.avatar,
      authenticatedAt: Date.now(),
    });

    const response = NextResponse.json({
      success: true,
      message: "Account created successfully! Welcome to Parkash Ceramics.",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        city: newUser.city,
        tier: newUser.tier,
        avatar: newUser.avatar,
        cart: null,
        wishlist: null,
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
    console.error("POST /api/auth/register error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create account." },
      { status: 500 }
    );
  }
}
