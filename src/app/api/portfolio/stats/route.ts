import { NextRequest, NextResponse } from "next/server";

import {
    portfolioService,
} from "@/services/portfolio.service";
import { withPortfolioReadAuthorization } from "@/lib/api/portfolio-read-handler";

export async function GET(request: NextRequest) {
    return withPortfolioReadAuthorization(request, async () => {
        const stats =
            await portfolioService.getStats();

        return NextResponse.json(
            {
                success: true,
                data: stats,
            },
            {
                status: 200,
            }
        );
    });
}
