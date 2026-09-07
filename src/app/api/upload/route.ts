import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { writeFile } from "fs/promises";
import path from "path";

const IS_VERCEL = process.env.VERCEL === "1";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // On Vercel: use Vercel Blob (cloud storage)
    // Locally: write to public/images/ as before
    if (IS_VERCEL) {
      const blob = await put(file.name, file, {
        access: "public",
      });

      return NextResponse.json({
        success: true,
        url: blob.url,
        fileName: file.name,
      });
    } else {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Clean file name
      const sanitizedName = file.name
        .toLowerCase()
        .replace(/[^a-z0-9.-]/g, "_");
      const fileName = `${Date.now()}_${sanitizedName}`;
      const uploadDir = path.join(process.cwd(), "public", "images");
      const filePath = path.join(uploadDir, fileName);

      await writeFile(filePath, buffer);

      const publicPath = `/images/${fileName}`;

      return NextResponse.json({
        success: true,
        url: publicPath,
        fileName,
      });
    }
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message || "Failed to upload image" }, { status: 500 });
  }
}
