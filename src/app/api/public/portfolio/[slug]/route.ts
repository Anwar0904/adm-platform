import { NextRequest } from "next/server";
import PublicContentService from "@/services/public-content.service";
import { PublicSlugSchema } from "@/validators/public.validator";
import { ApiResponse } from "@/lib/api/api-response";
import { portfolioPublicErrorResponse } from "@/lib/api/portfolio-public-response";
import { connectDB } from "@/lib/db";
type Params = { params: Promise<{ slug: string }> };
export async function GET(_request: NextRequest, { params }: Params) { try { const { slug } = PublicSlugSchema.parse(await params); await connectDB(); const response = ApiResponse.success(await PublicContentService.getPortfolioBySlug(slug)); response.headers.set("Cache-Control", "no-store"); return response; } catch (error) { return portfolioPublicErrorResponse(error); } }
