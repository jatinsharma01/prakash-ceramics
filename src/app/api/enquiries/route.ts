import { NextRequest, NextResponse } from "next/server";
import { getEnquiries, createEnquiry } from "@/lib/serverDb";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || undefined;
    const search = searchParams.get("search") || undefined;
    const source = searchParams.get("source") || undefined;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : undefined;

    const enquiries = await getEnquiries({
      status,
      search,
      source,
      limit,
    });

    return NextResponse.json({
      success: true,
      count: enquiries.length,
      enquiries,
    });
  } catch (error: any) {
    console.error("GET /api/enquiries error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch enquiries" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name || !body.phone) {
      return NextResponse.json(
        { success: false, message: "Name and Phone number are required." },
        { status: 400 }
      );
    }

    const enquiry = await createEnquiry({
      name: body.name.trim(),
      email: (body.email || "").trim(),
      phone: body.phone.trim(),
      projectType: body.projectType || "Residential Villa",
      preferredDate: body.preferredDate || undefined,
      message: (body.message || "").trim(),
      source: body.source || "Contact Page",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Consultation request recorded successfully! Our team will reach out soon.",
        enquiry,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/enquiries error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create enquiry" },
      { status: 500 }
    );
  }
}
