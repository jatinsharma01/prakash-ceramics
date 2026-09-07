import { NextRequest, NextResponse } from "next/server";
import { getEnquiryById, updateEnquiry, deleteEnquiry } from "@/lib/serverDb";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const enquiry = await getEnquiryById(id);

    if (!enquiry) {
      return NextResponse.json(
        { success: false, message: "Enquiry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, enquiry });
  } catch (error: any) {
    console.error("GET /api/enquiries/[id] error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch enquiry" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const allowedUpdates: Record<string, any> = {};
    if (body.status !== undefined) allowedUpdates.status = body.status;
    if (body.adminNotes !== undefined) allowedUpdates.adminNotes = body.adminNotes;
    if (body.projectType !== undefined) allowedUpdates.projectType = body.projectType;
    if (body.preferredDate !== undefined) allowedUpdates.preferredDate = body.preferredDate;

    const updated = await updateEnquiry(id, allowedUpdates);

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Enquiry not found or could not be updated" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Enquiry updated successfully",
      enquiry: updated,
    });
  } catch (error: any) {
    console.error("PATCH /api/enquiries/[id] error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update enquiry" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await deleteEnquiry(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Enquiry not found or could not be deleted" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Enquiry deleted successfully",
    });
  } catch (error: any) {
    console.error("DELETE /api/enquiries/[id] error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete enquiry" },
      { status: 500 }
    );
  }
}
