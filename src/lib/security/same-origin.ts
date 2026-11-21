import { NextRequest } from "next/server";
import { ApiError } from "@/lib/api/api-error";
import { SITE_URL } from "@/config/site";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

function allowedOrigins() {
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

export function enforceSameOrigin(request: NextRequest, options: { requireOrigin?: boolean } = {}) {
  if (SAFE_METHODS.has(request.method.toUpperCase())) return;

  const authorization = request.headers.get("authorization");
  if (authorization?.startsWith("Bearer ")) return;

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
    if (!allowedOrigins().has(parsed.origin)) throw new ApiError(403, "Cross-origin request denied.");
  } else if (options.requireOrigin || (request.cookies.getAll().length > 0 && fetchSite !== "same-origin" && fetchSite !== "same-site")) {
    throw new ApiError(403, "Origin header is required for this request.");
  }
}
