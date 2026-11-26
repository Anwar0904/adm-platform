"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";

type ApiResult = { success?: boolean; message?: string };

export default function ResetPasswordPage() {
  const [token, setToken] = useState("");
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.slice(1));
    // Remove sensitive URL fragment without transmitting it in a request.
    window.history.replaceState(null, "", window.location.pathname);
    window.setTimeout(() => {
      setToken(params.get("token") ?? "");
      setReady(true);
    }, 0);
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || !token) return;
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
      setError("Use at least 8 characters with uppercase, lowercase, a number and a symbol.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        credentials: "same-origin",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirmPassword }),
      });
      const result = (await response.json()) as ApiResult;
      if (!response.ok) {
        throw new Error(response.status === 429 ? "Too many attempts. Try again later." : result.message || "This link may have expired or already been used.");
      }
      setToken("");
      setPassword("");
      setConfirmPassword("");
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to reset password.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/5">
        <div className="text-xs font-bold uppercase tracking-widest text-blue-600">ADM Control Center</div>
        <h1 className="mt-2 text-3xl font-black text-slate-900">Reset password</h1>
        {!ready ? <p className="mt-5 text-slate-600">Checking reset link…</p> : done ? (
          <div role="status" className="mt-6 space-y-4">
            <p className="text-sm text-slate-700">Your password has been reset. You can now sign in with your new password.</p>
            <Link href="/admin/login" className="inline-block rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white">Return to sign in</Link>
          </div>
        ) : !token ? (
          <div className="mt-5 space-y-3">
            <p role="alert" className="text-sm text-red-700">This reset link is missing its token. Request a new link.</p>
            <Link href="/auth/forgot-password" className="font-semibold text-blue-700 hover:underline">Request a new reset link</Link>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-4">
            <p className="text-sm text-slate-600">Choose a unique password. A successful reset revokes your existing ADM sessions.</p>
            <div>
              <label htmlFor="new-password" className="block text-sm font-semibold text-slate-700">New password</label>
              <input id="new-password" type="password" required minLength={8} autoComplete="new-password" value={password} onChange={event => setPassword(event.target.value)} disabled={busy} className="mt-2 h-12 w-full rounded-xl border border-slate-300 px-4 text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100" />
            </div>
            <div>
              <label htmlFor="confirm-new-password" className="block text-sm font-semibold text-slate-700">Confirm new password</label>
              <input id="confirm-new-password" type="password" required minLength={8} autoComplete="new-password" value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} disabled={busy} className="mt-2 h-12 w-full rounded-xl border border-slate-300 px-4 text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100" />
            </div>
            {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
            <button type="submit" disabled={busy} className="h-12 w-full rounded-xl bg-blue-700 px-5 font-semibold text-white hover:bg-blue-800 disabled:opacity-60">{busy ? "Updating…" : "Reset password"}</button>
          </form>
        )}
        <div className="mt-7 border-t border-slate-100 pt-4"><Link href="/admin/login" className="text-sm font-semibold text-blue-700 hover:underline">Back to sign in</Link></div>
      </section>
    </main>
  );
}
