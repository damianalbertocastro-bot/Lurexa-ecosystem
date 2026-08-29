"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@lurexa/backend";
import { ProductMark } from "@lurexa/ui/ProductMark";
import { Button } from "@lurexa/ui/button";
import { Input } from "@lurexa/ui/Input";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (mode === "login") await AuthService.login(email, password);
      else await AuthService.register(email, password);
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "We could not complete that request.");
    } finally {
      setBusy(false);
    }
  };

  return <main className="grid min-h-screen place-items-center bg-[#f5f7ff] px-5 py-10"><section className="w-full max-w-md rounded-[30px] border border-[var(--lx-surface)] bg-white p-7 shadow-[0_24px_70px_rgba(31,50,120,.12)] sm:p-9"><ProductMark product="teach"/><p className="mt-8 text-[10px] font-extrabold tracking-[.18em] text-[var(--lx-primary)]">PROFESSIONAL GROWTH SPACE</p><h1 className="mt-3 text-3xl font-black tracking-[-.05em]">{mode === "login" ? "Continue with your Lurexa account." : "Start your Lurexa educator journey."}</h1><p className="mt-3 text-sm leading-6 text-[var(--lx-muted)]">{mode === "login" ? "Already teach in Lurexa Learn? Use the same account—no second Teach registration is required. Your professional learning stays connected to your Lurexa identity." : "Create a Lurexa account only if you do not already have one. You can begin in Teach as an educator learner without receiving student-teaching access in Learn."}</p><form className="mt-7 space-y-4" onSubmit={submit}><label className="block text-sm font-extrabold text-[#30457f]">Email<Input type="email" required autoComplete="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-[#d7e0f6] px-4 outline-none focus:border-[var(--lx-secondary)] focus:ring-4 focus:ring-[var(--lx-secondary)]/10"/></label><label className="block text-sm font-extrabold text-[#30457f]">Password<Input type="password" required minLength={6} autoComplete={mode === "login" ? "current-password" : "new-password"} value={password} onChange={(e)=>setPassword(e.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-[#d7e0f6] px-4 outline-none focus:border-[var(--lx-secondary)] focus:ring-4 focus:ring-[var(--lx-secondary)]/10"/></label>{error && <p role="alert" className="rounded-xl bg-[#fff0f2] p-3 text-sm font-bold text-[#b52c49]">{error}</p>}<Button disabled={busy} className="min-h-12 w-full rounded-xl bg-gradient-to-br from-[var(--lx-primary)] to-[var(--lx-secondary)] px-5 text-sm font-extrabold text-white disabled:opacity-60">{busy ? "Working…" : mode === "login" ? "Enter Lurexa Teach" : "Create Lurexa account"}</Button></form><Button type="button" onClick={()=>setMode(mode === "login" ? "register" : "login")} className="mt-5 min-h-11 w-full text-sm font-extrabold text-[var(--lx-secondary)]">{mode === "login" ? "New to all of Lurexa? Create an account" : "Already use any Lurexa product? Sign in"}</Button></section></main>;
}
