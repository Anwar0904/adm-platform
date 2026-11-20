import { z } from "zod";

const classification = z.enum([
  "client-project",
  "adm-product",
  "anonymized-engagement",
  "concept-prototype",
]);

const permittedElement = z.enum([
  "title",
  "shortDescription",
  "classification",
  "category",
  "visual",
  "technologies",
  "industries",
  "clientName",
  "projectUrl",
  "capabilities",
]);

export const PortfolioApprovalSchema = z.discriminatedUnion("approvalStatus", [
  z.object({
    approvalStatus: z.literal("approved"),
    classification,
    referenceId: z.string().trim().min(1).max(120),
    permittedElements: z.array(permittedElement).min(2).refine(
      (elements) => elements.includes("title") && elements.includes("shortDescription"),
      "Public approval must include title and short description.",
    ),
    capabilities: z.array(z.enum(["Technology", "Marketing", "AI", "Data"])).default([]),
    consentExpiresAt: z.coerce.date().nullable().optional(),
  }).strict(),
  z.object({
    approvalStatus: z.literal("revoked"),
    referenceId: z.string().trim().min(1).max(120),
  }).strict(),
]);

export type PortfolioApprovalInput = z.infer<typeof PortfolioApprovalSchema>;
