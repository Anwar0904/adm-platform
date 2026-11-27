import { NextRequest } from "next/server";
import { ApiError } from "@/lib/api/api-error";
import { SITE_URL } from "@/config/site";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);
const VERCEL_PREVIEW_HOST = /^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+vercel\.app$/i;

function configuredOrigins() {
  const origins = new Set<string>();
  const candidates = [SITE_URL, ...(process.env.ADM_ALLOWED_ORIGINS ?? "").split(",")];
  if (process.env.NODE_ENV !== "production") {
    candidates.push("http://localhost:3000", "http://127.0.0.1:3000");
  }
  for (const value of candidates) {
    try {
      origins.add(new URL(value.trim()).origin);
    } catch {
      // Ignore malformed configuration rather than widening the allowlist.
    }
  }
  return origins;
}

function vercelPreviewOrigins() {
  const origins = new Set<string>();
  if (process.env.VERCEL !== "1" || process.env.VERCEL_ENV !== "preview") return origins;

  for (const value of [process.env.VERCEL_URL, process.env.VERCEL_BRANCH_URL]) {
    if (!value) continue;
    try {
      // Vercel supplies these as hostnames. Require that exact metadata shape and
      // Vercel's deployment domain before treating it as an authorized origin.
      if (value !== value.trim() || value.includes("://")) continue;
      const parsed = new URL(`https://${value}`);
      if (
        parsed.username || parsed.password || parsed.port || parsed.pathname !== "/" ||
        parsed.search || parsed.hash || !VERCEL_PREVIEW_HOST.test(parsed.hostname) ||
        parsed.host !== value.toLowerCase()
      ) continue;
      origins.add(parsed.origin);
    } catch {
      // Ignore malformed deployment metadata rather than widening the allowlist.
    }
  }
  return origins;
}

function hasExpectedHost(request: NextRequest) {
  const host = request.headers.get("host");
  if (!host) return true;
  if (host !== host.trim()) return false;
  try {
    const parsed = new URL(`https://${host}`);
    return !parsed.username && !parsed.password && parsed.pathname === "/" &&
      !parsed.search && !parsed.hash && parsed.host === request.nextUrl.host.toLowerCase();
  } catch {
    return false;
  }
}

export function enforceSameOrigin(request: NextRequest, options: { requireOrigin?: boolean } = {}) {
  if (SAFE_METHODS.has(request.method.toUpperCase())) return;

  const hasBearerAuthorization = request.headers.get("authorization")?.startsWith("Bearer ") ?? false;

  if (!hasExpectedHost(request)) throw new ApiError(403, "Cross-origin request denied.");

  const origin = request.headers.get("origin");
  const fetchSite = request.headers.get("sec-fetch-site")?.toLowerCase();
  if (fetchSite === "cross-site") throw new ApiError(403, "Cross-origin request denied.");
  if (origin) {
    let parsed: URL;
    try {
      parsed = new URL(origin);
    } catch {
      throw new ApiError(403, "Cross-origin request denied.");
    }
    if (origin !== parsed.origin || parsed.username || parsed.password ||
        !new Set([...configuredOrigins(), ...vercelPreviewOrigins()]).has(parsed.origin)) {
      throw new ApiError(403, "Cross-origin request denied.");
    }
  } else if (
    (options.requireOrigin && !hasBearerAuthorization) ||
    (request.cookies.getAll().length > 0 && fetchSite !== "same-origin" && fetchSite !== "same-site")
  ) {
    throw new ApiError(403, "Origin header is required for this request.");
  }
}
