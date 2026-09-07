import { NextRequest, NextResponse } from "next/server";
import { getAllCustomersForAdmin, createCustomer } from "@/lib/userDb";

export async function GET() {
  try {
    const users = await getAllCustomersForAdmin();

    return NextResponse.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error: any) {
    console.error("GET /api/users error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name || !body.email || !body.phone) {
      return NextResponse.json(
        { success: false, message: "Name, email, and phone are required" },
        { status: 400 }
      );
    }

    const newCustomer = await createCustomer({
      name: body.name,
      email: body.email,
      phone: body.phone,
      password: body.password || "password123",
      city: body.city || "Delhi NCR",
      company: body.company,
    });

    const user = {
      id: newCustomer.id,
      name: newCustomer.name,
      email: newCustomer.email,
      phone: newCustomer.phone,
      avatar: newCustomer.avatar,
      city: newCustomer.city,
      company: newCustomer.company,
      status: "Active",
      joinedDate: new Date().toISOString().split("T")[0],
      totalOrders: 0,
      totalSpent: 0,
      lastOrderDate: new Date().toISOString().split("T")[0],
      addresses: [],
    };

    return NextResponse.json(
      {
        success: true,
        message: "Client account registered successfully",
        user,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/users error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create user" },
      { status: 500 }
    );
  }
}
