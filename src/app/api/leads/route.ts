import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";

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
        await connectDB();

        const contentType =
            request.headers.get(
                "content-type"
            ) ?? "";

        let data;

        if (
            contentType.includes(
                "multipart/form-data"
            )
        ) {
            const formData =
                await request.formData();

            const parsedBody: Record<
                string,
                unknown
            > = {
                attachments: [] as string[],
            };

            formData.forEach(
                (value, key) => {
                    if (key === "attachments") {
                        const attachments =
                            Array.isArray(
                                parsedBody.attachments
                            )
                                ? (parsedBody.attachments as string[])
                                : [];

                        parsedBody.attachments = [
                            ...attachments,
                            value instanceof File
                                ? value.name
                                : String(value),
                        ];
                    } else {
                        parsedBody[key] =
                            value instanceof File
                                ? value.name
                                : String(value);
                    }
                }
            );

            const budgetValue =
                parsedBody.budget;

            if (
                typeof budgetValue === "string" &&
                budgetValue.trim() !== ""
            ) {
                parsedBody.budget = {
                    amount: 0,
                    currency: "USD",
                    type: "fixed",
                };
            } else if (
                budgetValue === undefined ||
                budgetValue === null ||
                budgetValue === ""
            ) {
                parsedBody.budget = null;
            }

            data = CreateLeadSchema.parse(
                parsedBody
            );
        } else {
            const body =
                await request.json();

            data = CreateLeadSchema.parse(
                body
            );
        }

        const lead =
            await leadService.createLead(data);

        return ApiResponse.created(
            lead,
            "Lead created successfully."
        );
    } catch (error) {
        return handleApiError(error);
    }
}