import { createHash } from "node:crypto";
import { SITE_URL } from "@/config/site";

type AuthEmailKind = "password-reset" | "email-verification";

export class AuthEmailDeliveryError extends Error {
  readonly code: "not-configured" | "provider-failed";

  constructor(code: "not-configured" | "provider-failed") {
    super("Authentication email delivery is unavailable.");
    this.name = "AuthEmailDeliveryError";
    this.code = code;
  }
}

function getConfiguredBaseUrl() {
  const value = process.env.AUTH_EMAIL_BASE_URL?.trim();
  if (!value) return null;

  try {
    const url = new URL(value);
    if (url.username || url.password || url.search || url.hash) return null;
    if (process.env.NODE_ENV === "production" && url.protocol !== "https:") return null;
    const approvedOrigins = [SITE_URL, ...(process.env.ADM_ALLOWED_ORIGINS ?? "").split(",")]
      .flatMap((candidate) => {
        try { return [new URL(candidate.trim()).origin]; } catch { return []; }
      });
    if (!approvedOrigins.includes(url.origin)) return null;
    return url.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

export class AuthEmailService {
  static isConfigured() {
    return (
      process.env.AUTH_EMAIL_PROVIDER === "resend" &&
      Boolean(process.env.RESEND_API_KEY?.trim()) &&
      Boolean(process.env.AUTH_EMAIL_FROM?.trim()) &&
      Boolean(getConfiguredBaseUrl())
    );
  }

  static async sendPasswordReset(email: string, token: string) {
    await this.send(email, "password-reset", token);
  }

  static async sendVerification(email: string, token: string) {
    await this.send(email, "email-verification", token);
  }

  private static async send(email: string, kind: AuthEmailKind, token: string) {
    const apiKey = process.env.RESEND_API_KEY?.trim();
    const from = process.env.AUTH_EMAIL_FROM?.trim();
    const baseUrl = getConfiguredBaseUrl();

    if (
      process.env.AUTH_EMAIL_PROVIDER !== "resend" ||
      !apiKey || !from || !baseUrl
    ) {
      throw new AuthEmailDeliveryError("not-configured");
    }

    const path = kind === "password-reset" ? "/auth/reset-password" : "/auth/verify-email";
    const link = new URL(path, `${baseUrl}/`);
    // Keep bearer tokens in the fragment so they are not sent in HTTP request URLs or referrers.
    link.hash = new URLSearchParams({ token }).toString();
    const title = kind === "password-reset" ? "Reset your ADM password" : "Verify your ADM email";
    const instruction = kind === "password-reset"
      ? "Use this one-time link to choose a new password. If you did not request this, you can ignore this email."
      : "Use this one-time link to verify your email address. If you did not create an account, you can ignore this email.";
    const tokenDigest = createHash("sha256").update(token).digest("hex");
    const idempotencyKey = `${kind}/${tokenDigest}`;

    let response: Response;
    try {
      response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKey,
        },
        body: JSON.stringify({
          from,
          to: [email],
          subject: title,
          text: `${instruction}\n\n${link.toString()}`,
          html: `<p>${instruction}</p><p><a href="${link.toString()}">${title}</a></p>`,
        }),
        signal: AbortSignal.timeout(8_000),
        cache: "no-store",
        redirect: "error",
      });
    } catch {
      throw new AuthEmailDeliveryError("provider-failed");
    }

    if (!response.ok) {
      // Never retain or log provider response bodies; they can contain addresses or request details.
      throw new AuthEmailDeliveryError("provider-failed");
    }
  }
}
