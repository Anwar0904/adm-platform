"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

type ApiResult = { success?: boolean; message?: string };

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [accepted, setAccepted] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        credentials: "same-origin",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const result = (await response.json()) as ApiResult;
      if (!response.ok) {
        throw new Error(
          response.status === 503
            ? "Password recovery is currently unavailable. Contact your ADM administrator."
            : response.status === 429
              ? "Too many requests. Please try again later."
              : result.message || "Unable to process request."
        );
      }
      setAccepted(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to process request.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/5">
        <Link href="/admin/login" className="text-sm font-semibold text-blue-700 hover:underline">← Back to sign in</Link>
        <div className="mt-8 text-xs font-bold uppercase tracking-widest text-blue-600">ADM Control Center</div>
        <h1 className="mt-2 text-3xl font-black text-slate-900">Forgot password?</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">Enter your ADM account email. If the account is eligible, you will receive a one-time reset link.</p>
        {accepted ? (
          <div role="status" className="mt-7 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-slate-800">
            If the request is eligible, instructions will be sent. Check your inbox and spam folder. This message does not confirm whether an account exists.
          </div>
        ) : (
          <form onSubmit={submit} className="mt-7 space-y-4">
            <div>
              <label htmlFor="recovery-email" className="block text-sm font-semibold text-slate-700">Email address</label>
              <input id="recovery-email" type="email" required autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} disabled={busy} className="mt-2 h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100" placeholder="you@example.com" />
            </div>
            {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
            <button type="submit" disabled={busy} className="h-12 w-full rounded-xl bg-blue-700 px-5 font-semibold text-white hover:bg-blue-800 disabled:opacity-60">{busy ? "Sending…" : "Send reset link"}</button>
          </form>
        )}
      </section>
    </main>
  );
}
