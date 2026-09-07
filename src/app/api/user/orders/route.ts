import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/userAuth";
import { getUserOrders } from "@/lib/userDb";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }

    const orders = await getUserOrders(currentUser.email, currentUser.phone);

    return NextResponse.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error: any) {
    console.error("GET /api/user/orders error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
