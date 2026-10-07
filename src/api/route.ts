import { NextRequest, NextResponse } from "next/server";
import { getPaginatedProjectEpics } from "@/api/services/servicesApi";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const projectId = searchParams.get("projectId");
  const limit = Number(searchParams.get("limit")) || 10;
  const offset = Number(searchParams.get("offset")) || 0;

  if (!projectId) {
    return NextResponse.json(
      { success: false, message: "Project ID is required" },
      { status: 400 },
    );
  }

  const result = await getPaginatedProjectEpics(projectId, limit, offset);

  return NextResponse.json(result);
}
