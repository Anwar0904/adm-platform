"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

type RequestKind = "password-reset" | "email-verification";

export default function AuthRequestLinkForm({ kind }: { kind: RequestKind }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"ready" | "submitting" | "accepted" | "error">("ready");
  const isReset = kind === "password-reset";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    try {
      const response = await fetch(isReset ? "/api/auth/forgot-password" : "/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
        cache: "no-store",
      });
      if (!response.ok) throw new Error("request-failed");
      setState("accepted");
    } catch {
      setState("error");
    }
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
      <section aria-labelledby="auth-request-title" className="mx-auto w-full max-w-xl rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/20 sm:p-9">
        <p className="inline-flex rounded-full border border-blue-400/25 bg-blue-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-blue-200">Arazi Digital Media</p>
        <h1 id="auth-request-title" className="mt-5 text-3xl font-black text-white sm:text-4xl">{isReset ? "Reset your password" : "Request a verification email"}</h1>
        <p className="mt-3 leading-7 text-slate-300">{isReset ? "Enter the email address associated with your ADM account. If it is eligible, we will send a reset link." : "Enter your account email. If verification is still needed, we will send a new link."}</p>

        {state === "accepted" ? (
          <p role="status" className="mt-6 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-emerald-100">If the request is eligible, next steps will be sent.</p>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-4">
            <label className="block text-sm font-semibold text-slate-200">Email address<input type="email" autoComplete="email" required maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-slate-950 px-4 text-white outline-none focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20" /></label>
            {state === "error" && <p role="alert" className="text-sm text-rose-300">This request is temporarily unavailable. Please try again later.</p>}
            <button type="submit" disabled={state === "submitting"} className="site-button-primary min-h-12 w-full disabled:opacity-60">{state === "submitting" ? "Sending request…" : "Send email"}</button>
          </form>
        )}

        <Link href="/admin/login" className="mt-6 inline-flex min-h-11 items-center rounded-xl border border-white/10 bg-white/5 px-4 font-semibold text-slate-100 hover:border-blue-400">Return to sign in</Link>
      </section>
    </div>
  );
}
