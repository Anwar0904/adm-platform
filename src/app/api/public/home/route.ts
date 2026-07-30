import PublicContentService from "@/services/public-content.service";
import { ApiResponse } from "@/lib/api/api-response";
import { handleApiError } from "@/lib/api/error-handler";
export async function GET() { try { return ApiResponse.success(await PublicContentService.getHomePage()); } catch (error) { return handleApiError(error); } }
