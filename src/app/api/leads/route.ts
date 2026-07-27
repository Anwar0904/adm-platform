import { NextRequest } from "next/server";


import {
    CreateLeadSchema,
    LeadQuerySchema,
} from "@/validators/lead.validator";

import { ApiResponse } from "@/lib/api/api-response";
import { handleApiError } from "@/lib/api/error-handler";

import {
    requireAuth,
    requirePermission,
} from "@/lib/auth/require-auth";

import { PERMISSIONS } from "@/constants/permissions";
import leadService from "@/services/lead.service";


export async function GET(
    request: NextRequest
) {
    try {
        await requirePermission(
            request,
            PERMISSIONS.LEAD_READ
        );

        const query =
            LeadQuerySchema.parse(
                Object.fromEntries(
                    request.nextUrl.searchParams.entries()
                )
            );

        const result =
            await leadService.getLeads(
                query
            );

        return ApiResponse.success(
            result,
            "Leads fetched successfully."
        );
    } catch (error) {
        return handleApiError(error);
    }
}

export async function POST(
    request: NextRequest
) {
    try {
        const user =
            await requireAuth(
                request
            );

        const body =
            await request.json();

        const data =
            CreateLeadSchema.parse(
                body
            );

        const lead =
            await leadService.createLead(
                data,
                user?._id?.toString()
            );

        return ApiResponse.created(
            lead,
            "Lead created successfully."
        );
    } catch (error) {
        return handleApiError(error);
    }
}