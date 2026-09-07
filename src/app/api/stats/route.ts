import { NextResponse } from "next/server";
import { getAdminStats } from "@/lib/serverDb";

export async function GET() {
  try {
    const stats = await getAdminStats();
    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
