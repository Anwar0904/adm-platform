import type { QueryFilter } from "mongoose";
import type { IPortfolio } from "@/types/portfolio.types";

export const PUBLIC_PROOF_CLASSIFICATIONS = [
  "client-project",
  "adm-product",
  "anonymized-engagement",
  "concept-prototype",
] as const;

export type PublicProofClassification = (typeof PUBLIC_PROOF_CLASSIFICATIONS)[number];
export type PublicProofElement =
  | "title"
  | "shortDescription"
  | "classification"
  | "category"
  | "visual"
  | "technologies"
  | "industries"
  | "clientName"
  | "projectUrl";

export type PublicProofApproval = {
  approvalStatus?: string;
  approvedAt?: Date | string | null;
  approvedByRole?: string;
  referenceId?: string;
  permittedElements?: string[];
  consentExpiresAt?: Date | string | null;
  classification?: string | null;
};

function validDate(value: Date | string | null | undefined): Date | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function isPublicProofEligible(
  status: string,
  isDeleted: boolean,
  proof: PublicProofApproval | null | undefined,
  now = new Date(),
): boolean {
  if (status !== "published" || isDeleted || !proof) return false;
  if (proof.approvalStatus !== "approved") return false;
  if (!validDate(proof.approvedAt)) return false;
  if (!proof.approvedByRole?.trim() || !proof.referenceId?.trim()) return false;
  if (!PUBLIC_PROOF_CLASSIFICATIONS.includes(proof.classification as PublicProofClassification)) return false;
  if (!proof.permittedElements?.includes("title") || !proof.permittedElements.includes("shortDescription")) return false;

  const expiresAt = validDate(proof.consentExpiresAt);
  return !proof.consentExpiresAt || Boolean(expiresAt && expiresAt > now);
}

export function normalizePublicUrl(value?: string | null): string | undefined {
  if (!value?.trim()) return undefined;
  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

export function normalizePublicMediaUrl(value?: string | null): string | undefined {
  if (!value?.trim()) return undefined;
  const input = value.trim();
  if (input.startsWith("/") && !input.startsWith("//")) return input;
  try {
    const url = new URL(input);
    const hostAllowed = url.hostname === "images.unsplash.com"
      || url.hostname === "encrypted-tbn0.gstatic.com"
      || url.hostname.endsWith(".public.blob.vercel-storage.com");
    return url.protocol === "https:" && hostAllowed ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

export function publicProofMongoFilter(now = new Date()): QueryFilter<IPortfolio> {
  return {
    "publicProof.approvalStatus": "approved",
    "publicProof.approvedAt": { $type: "date" },
    "publicProof.approvedByRole": { $type: "string", $ne: "" },
    "publicProof.referenceId": { $type: "string", $ne: "" },
    "publicProof.permittedElements": { $all: ["title", "shortDescription"] },
    "publicProof.classification": { $in: PUBLIC_PROOF_CLASSIFICATIONS },
    $or: [
      { "publicProof.consentExpiresAt": null },
      { "publicProof.consentExpiresAt": { $exists: false } },
      { "publicProof.consentExpiresAt": { $gt: now } },
    ],
  } as QueryFilter<IPortfolio>;
}



