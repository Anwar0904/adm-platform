import { NextRequest, NextResponse } from "next/server";

import {
    portfolioService,
} from "@/services/portfolio.service";

interface RouteContext {
    params: Promise<{
        id: string;
    }>;
}

export async function GET(
    _request: NextRequest,
    context: RouteContext
) {
    try {
        const { id } =
            await context.params;

        const portfolio =
            await portfolioService.getById(
                id
            );

        return NextResponse.json(
            {
                success: true,
                data: portfolio,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error(
            "GET /api/portfolio/[id] error:",
            error
        );

        const message =
            error instanceof Error
                ? error.message
                : "Failed to fetch portfolio project.";

        const status =
            message.includes(
                "not found"
            )
                ? 404
                : 400;

        return NextResponse.json(
            {
                success: false,
                message,
            },
            {
                status,
            }
        );
    }
}

export async function PATCH(
    request: NextRequest,
    context: RouteContext
) {
    try {
        const { id } =
            await context.params;

        const body =
            await request.json();

        /*
         * TEMPORARY:
         * Replace this with the authenticated
         * user's ID from your session.
         */
        const updatedBy =
            body.updatedBy;

        if (!updatedBy) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "UpdatedBy is required.",
                },
                {
                    status: 400,
                }
            );
        }

        const portfolio =
            await portfolioService.update(
                id,
                body,
                updatedBy
            );

        if (!portfolio) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Portfolio project not found.",
                },
                {
                    status: 404,
                }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message:
                    "Portfolio project updated successfully.",
                data: portfolio,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error(
            "PATCH /api/portfolio/[id] error:",
            error
        );

        const message =
            error instanceof Error
                ? error.message
                : "Failed to update portfolio project.";

        return NextResponse.json(
            {
                success: false,
                message,
            },
            {
                status: 400,
            }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    context: RouteContext
) {
    try {
        const { id } =
            await context.params;

        /*
         * TEMPORARY:
         * Replace this with authenticated
         * user's ID.
         */
        const body =
            await request.json();

        const deletedBy =
            body.deletedBy;

        if (!deletedBy) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "DeletedBy is required.",
                },
                {
                    status: 400,
                }
            );
        }

        await portfolioService.delete(
            id,
            deletedBy
        );

        return NextResponse.json(
            {
                success: true,
                message:
                    "Portfolio project deleted successfully.",
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error(
            "DELETE /api/portfolio/[id] error:",
            error
        );

        const message =
            error instanceof Error
                ? error.message
                : "Failed to delete portfolio project.";

        return NextResponse.json(
            {
                success: false,
                message,
            },
            {
                status: 400,
            }
        );
    }
}