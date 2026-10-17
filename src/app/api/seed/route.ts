import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
  return NextResponse.json({
    success: true,
    message: "Automatic database seeding via API is disabled to protect production database integrity.",
  });
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Automatic database seeding via API is disabled to protect production database integrity.",
  });
}
