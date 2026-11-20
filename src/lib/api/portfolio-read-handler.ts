import { NextRequest, NextResponse } from "next/server";
import { ApiErrorHandler } from "@/lib/api/api-error";
import { privateNoStore } from "@/lib/api/private-response";
import { PERMISSIONS } from "@/constants/permissions";
import { requirePermission } from "@/lib/auth/require-auth";

type PermissionCheck = (request: NextRequest, permission: string) => Promise<unknown>;

export async function withPortfolioReadAuthorization(
  request: NextRequest,
  handler: () => Promise<NextResponse>,
  checkPermission: PermissionCheck = requirePermission,
): Promise<NextResponse> {
  try {
    await checkPermission(request, PERMISSIONS.PORTFOLIO_READ);
    return privateNoStore(await handler());
  } catch (error) {
    return privateNoStore(ApiErrorHandler.handle(error));
  }
}
