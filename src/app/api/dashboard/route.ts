import { NextRequest } from "next/server";

import DashboardService from "@/services/dashboard.service";

import { ApiResponse } from "@/lib/api/api-response";
import { handleApiError } from "@/lib/api/error-handler";

import {
    requirePermission,
} from "@/lib/auth/require-auth";

import { PERMISSIONS } from "@/constants/permissions";

export async function GET(
    request: NextRequest
) {
    try {
        await requirePermission(
            request,
            PERMISSIONS.SETTINGS_MANAGE
        );

        const dashboard =
            await DashboardService.getDashboard();

        return ApiResponse.success(
            dashboard,
            "Dashboard fetched successfully."
        );
    } catch (error) {
        return handleApiError(error);
    }
}