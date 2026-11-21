import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requirePermission } from "@/middleware/auth.middleware";
import { PERMISSIONS } from "@/constants/permissions";

export async function GET(request: NextRequest) {
  // Keep the route available for authenticated operations checks outside production.
  // Production health should be checked by the hosting platform, not expose DB state.
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ success: false, message: "Not found." }, { status: 404 });
  }

  try {
    await requirePermission(request, PERMISSIONS.SETTINGS_MANAGE);
    await connectDB();

    return NextResponse.json({
      success: true,
      message: "MongoDB connected successfully.",
    });
  } catch {

    return NextResponse.json(
      {
        success: false,
        message: "Database connection failed.",
      },
      {
        status: 500,
      }
    );
  }
}
