import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/userAuth";
import { getAddressesByUser, createAddress } from "@/lib/userDb";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ success: false, message: "Unauthorized. Please sign in." }, { status: 401 });
    }

    const addresses = await getAddressesByUser(currentUser.id);
    return NextResponse.json({
      success: true,
      addresses,
    });
  } catch (error: any) {
    console.error("GET /api/user/addresses error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch addresses" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ success: false, message: "Unauthorized. Please sign in." }, { status: 401 });
    }

    const body = await request.json();
    const { fullName, phone, estateOrProject, address, city, state, pincode, landmark, label, isDefault } = body;

    if (!fullName || !phone || !address || !city || !state || !pincode) {
      return NextResponse.json(
        { success: false, message: "Recipient name, phone, address, city, state, and pincode are required." },
        { status: 400 }
      );
    }

    const created = await createAddress(currentUser.id, {
      fullName,
      phone,
      estateOrProject,
      address,
      city,
      state,
      pincode,
      landmark,
      label,
      isDefault,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Address saved successfully.",
        address: created,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/user/addresses error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create address" },
      { status: 500 }
    );
  }
}
