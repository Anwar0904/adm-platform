"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";

type Flow = "verify" | "reset";
type State = "loading" | "ready" | "submitting" | "success" | "error";

function readAndRemoveToken() {
  const token = new URLSearchParams(window.location.hash.slice(1)).get("token");
  window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
  return token;
}

export default function AuthEmailActions({ flow }: { flow: Flow }) {
  const [token, setToken] = useState("");
  const [state, setState] = useState<State>(flow === "verify" ? "loading" : "ready");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const verificationStarted = useRef(false);

  useEffect(() => {
    const incoming = readAndRemoveToken();
    if (!incoming) {
      queueMicrotask(() => setState("error"));
      return;
    }
    queueMicrotask(() => setToken(incoming));

    if (flow === "verify" && !verificationStarted.current) {
      verificationStarted.current = true;
      void fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: incoming }),
        cache: "no-store",
      }).then(async (response) => {
        if (!response.ok) throw new Error("verification-failed");
        setState("success");
      }).catch(() => setState("error"));
    }
  }, [flow]);

  async function submitReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password !== confirmPassword) {
      setState("error");
      return;
    }
    setState("submitting");
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
        cache: "no-store",
      });
      if (!response.ok) throw new Error("reset-failed");
      setPassword("");
      setConfirmPassword("");
      setToken("");
      setState("success");
    } catch {
      setState("error");
    }
  }

  const title = flow === "verify" ? "Verify your email" : "Choose a new password";
  const successfulMessage = flow === "verify" ? "Your email has been verified." : "Your password has been reset. Other active sessions have been signed out.";
  const strongPassword = password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
      <section aria-labelledby="auth-email-title" className="mx-auto w-full max-w-xl rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/20 sm:p-9">
        <p className="inline-flex rounded-full border border-blue-400/25 bg-blue-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-blue-200">Arazi Digital Media</p>
        <h1 id="auth-email-title" className="mt-5 text-3xl font-black text-white sm:text-4xl">{title}</h1>

        {state === "loading" && <p role="status" className="mt-4 text-slate-300">Verifying your email…</p>}
        {state === "success" && <div role="status" className="mt-5"><p className="text-slate-200">{successfulMessage}</p><Link href="/admin/login" className="site-button-primary mt-6">Continue to sign in</Link></div>}
        {state === "error" && <div role="alert" className="mt-5"><p className="text-slate-200">This link is invalid, expired, or could not be processed. Request a new link or contact your administrator.</p><Link href="/admin/login" className="mt-5 inline-flex min-h-11 items-center rounded-xl border border-white/10 bg-white/5 px-4 font-semibold text-slate-100 hover:border-blue-400">Return to sign in</Link></div>}

        {flow === "reset" && (state === "ready" || state === "submitting") && token && <form onSubmit={submitReset} className="mt-6 space-y-4">
          <label className="block text-sm font-semibold text-slate-200">New password<input type="password" autoComplete="new-password" required minLength={8} maxLength={100} value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-slate-950 px-4 text-white outline-none focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20" /></label>
          <p className="text-xs leading-5 text-slate-400">Use at least 8 characters with uppercase, lowercase, number and special character.</p>
          <label className="block text-sm font-semibold text-slate-200">Confirm new password<input type="password" autoComplete="new-password" required minLength={8} maxLength={100} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-slate-950 px-4 text-white outline-none focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20" /></label>
          {password !== confirmPassword && confirmPassword && <p className="text-sm text-rose-300">Passwords do not match.</p>}
          <button type="submit" disabled={state === "submitting" || !strongPassword || password !== confirmPassword} className="site-button-primary min-h-12 w-full disabled:cursor-not-allowed disabled:opacity-60">{state === "submitting" ? "Updating password…" : "Reset password"}</button>
        </form>}
      </section>
    </div>
  );
}
