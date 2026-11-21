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

        const avatar =
            typeof user.avatar === "string"
                ? user.avatar
                : user.avatar?.url ?? null;

        const response = ApiResponse.success(
            {
                _id: user._id.toString(),
                name: `${user.firstName} ${user.lastName}`.trim(),
                email: user.email,
                avatar,
                jobTitle: user.jobTitle ?? null,
            },
            "Current user fetched successfully."
        );
        response.headers.set("Cache-Control", "no-store, private");
        response.headers.set("Pragma", "no-cache");
        return response;
    } catch (error) {
        return ApiErrorHandler.handle(error);
    }
}
