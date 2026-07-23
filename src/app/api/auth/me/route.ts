import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";

import { ApiResponse } from "@/lib/api/api-response";
import { ApiErrorHandler } from "@/lib/api/api-error";

import { requireAuth } from "@/middleware/auth.middleware";

export async function GET(
    request: NextRequest
) {
    try {
        await connectDB();

        const user =
            await requireAuth(request);

        return ApiResponse.success(
            user,
            "Current user fetched successfully."
        );
    } catch (error) {
        return ApiErrorHandler.handle(error);
    }
}