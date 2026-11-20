import { NextRequest } from "next/server";
import PublicContentService from "@/services/public-content.service";
import { PublicContentQuerySchema } from "@/validators/public.validator";
import { ApiResponse } from "@/lib/api/api-response";
import { portfolioPublicErrorResponse } from "@/lib/api/portfolio-public-response";
import { connectDB } from "@/lib/db";
export async function GET(request: NextRequest) { try { await connectDB(); const query = PublicContentQuerySchema.parse(Object.fromEntries(request.nextUrl.searchParams)); const response = ApiResponse.success(await PublicContentService.getPortfolio(query)); response.headers.set("Cache-Control", "no-store"); return response; } catch (error) { return portfolioPublicErrorResponse(error); } }
