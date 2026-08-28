"use client";

import React, { Suspense, useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductMark } from "@lurexa/ui/ProductMark";
import { AuthService } from "@lurexa/backend";

function authMessage(error: unknown, mode: "login" | "register"): string {
  const code = typeof error === "object" && error !== null && "code" in error ? String((error as { code?: unknown }).code) : "";
  if (code === "auth/email-already-in-use") return "This email already belongs to a Lurexa account. Sign in instead of creating another account.";
  if (code === "auth/invalid-credential" || code === "auth/wrong-password" || code === "auth/user-not-found") return "We could not sign you in with those credentials. Use the same email and password you use in your other Lurexa products.";
  if (code === "auth/weak-password") return "Use a stronger password with at least 6 characters.";
  if (code === "auth/invalid-email") return "Enter a valid email address.";
  if (mode === "register") return "We could not create your Lurexa account. If you already use another Lurexa product, switch to Sign in.";
  return error instanceof Error ? error.message : "We could not complete that request.";
}

export default function LoginPage() {
function readSafeContinueTo(value: string | null): string | null {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : null;
}

function CoachLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setLoading(true);
    setError(null);
    try {
      if (mode === "login") await AuthService.login(email, password);
      else await AuthService.register(email, password);
      const requested = new URLSearchParams(window.location.search).get("continue");
      const safeDestination = requested?.startsWith("/") && !requested.startsWith("//") ? requested : "/dashboard";
      router.replace(safeDestination);
    } catch (caught) {
      setError(authMessage(caught, mode));
    } finally {
      setBusy(false);
    }
  }

  return <main className="grid min-h-screen place-items-center bg-gradient-to-br from-[#eefbff] via-[#f5f2ff] to-[#eef3ff] px-5 py-10"><section className="w-full max-w-md rounded-[32px] border border-[#dce8f5] bg-white p-7 shadow-[0_24px_70px_rgba(31,50,120,.12)] sm:p-9"><ProductMark product="coach"/><p className="mt-8 text-[10px] font-black tracking-[.18em] text-[#6b2bd9]">ONE LUREXA IDENTITY</p><h1 className="mt-3 text-3xl font-black tracking-[-.05em]">{mode === "login" ? "Continue your speaking journey." : "Create your Lurexa account."}</h1><p className="mt-3 text-sm leading-6 text-[#6677a5]">{mode === "login" ? "Already use Learn, Teach, or another learner product? Sign in with that same Lurexa account. You do not need a Coach-specific registration." : "Create an account only if you are new to Lurexa. This identity is designed to follow you into other Lurexa learner products."}</p><form onSubmit={submit} className="mt-7 space-y-4"><label className="block text-sm font-extrabold text-[#30457f]">Email<input required type="email" autoComplete="email" value={email} onChange={(event)=>setEmail(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-[#d7e0f6] px-4 outline-none focus:border-[#315fd7] focus:ring-4 focus:ring-[#315fd7]/10"/></label><label className="block text-sm font-extrabold text-[#30457f]">Password<input required type="password" minLength={6} autoComplete={mode === "login" ? "current-password" : "new-password"} value={password} onChange={(event)=>setPassword(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-[#d7e0f6] px-4 outline-none focus:border-[#315fd7] focus:ring-4 focus:ring-[#315fd7]/10"/></label>{error ? <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm font-bold text-rose-800">{error}</p> : null}<button disabled={busy} className="min-h-12 w-full rounded-xl bg-gradient-to-br from-[#6b2bd9] to-[#315fd7] px-5 text-sm font-black text-white disabled:opacity-60">{busy ? "Working…" : mode === "login" ? "Enter Lurexa Coach" : "Create Lurexa account"}</button></form><button type="button" onClick={()=>{ setError(""); setMode(mode === "login" ? "register" : "login"); }} className="mt-5 min-h-11 w-full text-sm font-black text-[#315fd7]">{mode === "login" ? "New to all of Lurexa? Create an account" : "Already use any Lurexa product? Sign in"}</button><a href="https://lurexa.org" className="mt-3 flex min-h-10 items-center justify-center text-xs font-extrabold text-[#6074a5]">Back to Lurexa ecosystem</a></section></main>;
      if (mode === "login") {
        await AuthService.login(email, password);
      } else {
        await AuthService.register(email, password);
      }

      const continueTo = readSafeContinueTo(searchParams.get("continue"));
      router.replace(continueTo || "/dashboard");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : mode === "login"
          ? "Unable to sign in. Please verify your credentials."
          : "Unable to create your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAccess = () => {
    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#eefbff] via-[#f5f2ff] to-[#eef3ff] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-block transition-transform hover:scale-105">
          <ProductMark product="coach" size="lg" />
        </Link>
        <p className="mt-4 text-[11px] font-black uppercase tracking-[0.2em] text-[#6b2bd9]">
          One Lurexa Identity
        </p>
        <h1 className="mt-2 text-2xl sm:text-3xl font-black tracking-[-0.04em] text-slate-900">
          {mode === "login" ? "Continue your speaking journey" : "Create your Lurexa account"}
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-sm mx-auto">
          {mode === "login"
            ? "Sign in with your existing Lurexa Learn or Teach account. No second account is required."
            : "One account connects your practice across Coach, Learn, and Teach."}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-3xl border border-[#dce8f5] bg-white p-7 sm:p-9 shadow-[0_24px_70px_rgba(31,50,120,0.1)]">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div
                role="alert"
                className="rounded-2xl bg-rose-50 border border-rose-200 p-3.5 text-xs text-rose-800 font-semibold"
              >
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#6b2bd9] focus:bg-white focus:ring-4 focus:ring-[#6b2bd9]/10"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#6b2bd9] focus:bg-white focus:ring-4 focus:ring-[#6b2bd9]/10"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-[#6b2bd9] to-[#315fd7] py-3 text-xs font-extrabold uppercase tracking-wider text-white shadow-md shadow-purple-500/20 transition hover:opacity-95 active:scale-[0.98] disabled:opacity-50"
            >
              {loading
                ? "Working…"
                : mode === "login"
                ? "Sign In to Coach"
                : "Create Lurexa Account"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => {
                setError(null);
                setMode(mode === "login" ? "register" : "login");
              }}
              className="text-xs font-bold text-[#315fd7] hover:underline"
            >
              {mode === "login"
                ? "New to Lurexa? Create an account"
                : "Already have a Learn, Teach, or Coach account? Sign in"}
            </button>
          </div>

          <div className="mt-6 border-t border-slate-100 pt-6">
            <button
              type="button"
              onClick={handleDemoAccess}
              disabled={loading}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100 active:scale-[0.98]"
            >
              🚀 Quick Demo Access (Guest Learner)
            </button>
          </div>

          <div className="mt-6 text-center text-xs text-slate-500">
            <span>Want to test your English speaking level first? </span>
            <Link href="/placement" className="font-bold text-[#6b2bd9] hover:underline">
              Take Free Speaking Placement
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function CoachLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-8 text-sm text-slate-600">
          Loading Coach sign in…
        </div>
      }
    >
      <CoachLoginForm />
    </Suspense>
  );
}
