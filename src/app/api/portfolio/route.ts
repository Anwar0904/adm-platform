import { NextRequest, NextResponse } from "next/server";

import {
    CONTENT_STATUS,
    ContentStatus,
} from "@/enums";

import {
    portfolioService,
} from "@/services/portfolio.service";

import {
    isEnumValue,
} from "@/utils/enum.utils";

export async function GET(
    request: NextRequest
) {
    try {
        const { searchParams } =
            new URL(request.url);

        const search =
            searchParams.get("search") ||
            undefined;

        const statusParam =
            searchParams.get("status");

        let status:
            | ContentStatus
            | undefined;

        if (statusParam) {
            if (
                !isEnumValue(
                    CONTENT_STATUS,
                    statusParam
                )
            ) {
                return NextResponse.json(
                    {
                        success: false,
                        message: `Invalid portfolio status: ${statusParam}`,
                    },
                    {
                        status: 400,
                    }
                );
            }

            status = statusParam;
        }

        const featuredParam =
            searchParams.get("featured");

        const featured =
            featuredParam === null
                ? undefined
                : featuredParam === "true";

        const pageParam =
            Number(
                searchParams.get("page")
            ) || 1;

        const limitParam =
            Number(
                searchParams.get("limit")
            ) || 10;

        const result =
            await portfolioService.getAll({
                search,
                status,
                featured,
                page: Math.max(
                    1,
                    pageParam
                ),
                limit: Math.min(
                    100,
                    Math.max(
                        1,
                        limitParam
                    )
                ),
            });

        return NextResponse.json(
            {
                success: true,
                data: result.data,
                pagination: {
                    total: result.total,
                    page: result.page,
                    limit: result.limit,
                    totalPages:
                        result.totalPages,
                },
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error(
            "GET /api/portfolio error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Failed to fetch portfolio projects.",
            },
            {
                status: 500,
            }
        );
    }
}
export async function POST(
    request: NextRequest
) {
    try {
        const body =
            await request.json();

        /*
         * TEMPORARY:
         * We will replace this with
         * the authenticated user's ID
         * from your session system.
         */
        const authorId =
            body.authorId;

        if (!authorId) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Author ID is required.",
                },
                {
                    status: 400,
                }
            );
        }

        const portfolio =
            await portfolioService.create(
                body,
                authorId
            );

        return NextResponse.json(
            {
                success: true,
                message:
                    "Portfolio project created successfully.",
                data: portfolio,
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        console.error(
            "POST /api/portfolio error:",
            error
        );

        const message =
            error instanceof Error
                ? error.message
                : "Failed to create portfolio project.";

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