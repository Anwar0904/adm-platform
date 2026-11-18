import { connectDB } from "@/lib/db";
import { seedRoles } from "@/lib/seed/roles.seed";
import { ApiResponse } from "@/lib/api/api-response";
import { ApiErrorHandler } from "@/lib/api/api-error";
import { requireAuth } from "@/lib/auth/require-auth";
import { requireSuperAdmin } from "@/lib/auth/super-admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    if (process.env.NODE_ENV === "production") {
        return NextResponse.json(
            { success: false, message: "Not found." },
            { status: 404 }
        );
    }

    try {
        await connectDB();
        const user = await requireAuth(request);
        const role = user.role;
        requireSuperAdmin(
            typeof role === "object" &&
                role !== null &&
                "name" in role &&
                typeof role.name === "string"
                ? { name: role.name }
                : null
        );

        await seedRoles();

        return ApiResponse.success(
            null,
            "Roles seeded successfully."
        );
    } catch (error) {
        return ApiErrorHandler.handle(error);
    }
}
