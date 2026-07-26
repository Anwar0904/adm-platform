import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";

import { ApiResponse } from "@/lib/api/api-response";
import { ApiErrorHandler } from "@/lib/api/api-error";

import serviceService from "@/services/service.service";

import {
    CreateServiceSchema,
    ServiceQuerySchema,
} from "@/validators/service.validator";

import {
    requirePermission,
} from "@/middleware/auth.middleware";

import { SERVICE_MESSAGES } from "@/constants/service";
import { PERMISSIONS } from "@/constants/permissions";

export async function GET(
    request: NextRequest
) {
    try {
        await connectDB();

        await requirePermission(
            request,
            PERMISSIONS.SERVICE_READ
        );

        const query =
            ServiceQuerySchema.parse(
                Object.fromEntries(
                    request.nextUrl.searchParams
                )
            );

        const result =
            await serviceService.getServices(
                query
            );

        return ApiResponse.success(
            result,
            SERVICE_MESSAGES.FETCHED
        );
    } catch (error) {
        return ApiErrorHandler.handle(error);
    }
}

export async function POST(
    request: NextRequest
) {
    try {
        await connectDB();

        const currentUser =
            await requirePermission(
                request,
                PERMISSIONS.SERVICE_CREATE
            );

        const body =
            await request.json();

        const data =
            CreateServiceSchema.parse(
                body
            );

        const service =
            await serviceService.createService(
                data,
                currentUser._id.toString()
            );

        return ApiResponse.success(
            service,
            SERVICE_MESSAGES.CREATED,
            201
        );
    } catch (error) {
        return ApiErrorHandler.handle(error);
    }
}