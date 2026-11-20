import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { ApiError, ApiErrorHandler } from "@/lib/api/api-error";
import { privateNoStore } from "@/lib/api/private-response";
import { requirePermission } from "@/lib/auth/require-auth";
import { PERMISSIONS } from "@/constants/permissions";
import { CONTENT_STATUS } from "@/enums";
import { Portfolio } from "@/models/portfolio.model";
import { PortfolioApprovalSchema } from "@/validators/portfolio-approval.validator";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const user = await requirePermission(request, PERMISSIONS.PORTFOLIO_APPROVE);
    await connectDB();
    const { id } = await params;
    const input = PortfolioApprovalSchema.parse(await request.json());
    const roleName = typeof user.role === "object" && user.role && "name" in user.role
      ? String(user.role.name)
      : "unknown";

    const project = await Portfolio.findOne({ _id: id, status: CONTENT_STATUS.PUBLISHED, isDeleted: false });
    if (!project) throw new ApiError(404, "Published portfolio project not found.");

    const now = new Date();
    if (input.approvalStatus === "approved") {
      project.publicProof = {
        approvalStatus: "approved",
        approvedAt: now,
        approvedByRole: roleName,
        referenceId: input.referenceId,
        permittedElements: input.permittedElements,
        consentExpiresAt: input.consentExpiresAt ?? null,
        revokedAt: null,
        revokedByRole: "",
        classification: input.classification,
        capabilities: input.capabilities,
      };
    } else {
      project.publicProof = {
        ...project.publicProof,
        approvalStatus: "revoked",
        referenceId: input.referenceId,
        revokedAt: now,
        revokedByRole: roleName,
        permittedElements: project.publicProof?.permittedElements ?? [],
        classification: project.publicProof?.classification ?? undefined,
        capabilities: project.publicProof?.capabilities ?? [],
      };
    }

    await project.save();
    return privateNoStore(NextResponse.json({ success: true, data: project.publicProof }));
  } catch (error) {
    return privateNoStore(ApiErrorHandler.handle(error));
  }
}
