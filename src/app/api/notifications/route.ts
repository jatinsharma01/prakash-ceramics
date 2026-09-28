import { NextRequest, NextResponse } from "next/server";
import { GET as adminGet, POST as adminPost } from "../admin/notifications/route";

export async function GET(request: NextRequest) {
  return adminGet(request);
}

export async function POST(request: NextRequest) {
  return adminPost(request);
}
