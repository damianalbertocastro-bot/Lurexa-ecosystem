"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@lurexa/backend";
import { ProductMark } from "@lurexa/ui/ProductMark";

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

  return <main className="grid min-h-screen place-items-center bg-[#f5f7ff] px-5 py-10"><section className="w-full max-w-md rounded-[30px] border border-[#dfe6f8] bg-white p-7 shadow-[0_24px_70px_rgba(31,50,120,.12)] sm:p-9"><ProductMark product="teach"/><p className="mt-8 text-[10px] font-extrabold tracking-[.18em] text-[#6b2bd9]">PROFESSIONAL GROWTH SPACE</p><h1 className="mt-3 text-3xl font-black tracking-[-.05em]">{mode === "login" ? "Welcome back." : "Create your educator profile."}</h1><p className="mt-3 text-sm leading-6 text-[#6677a5]">Use your Lurexa account to continue your professional learning, evidence, credentials, and community activity.</p><form className="mt-7 space-y-4" onSubmit={submit}><label className="block text-sm font-extrabold text-[#30457f]">Email<input type="email" required autoComplete="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-[#d7e0f6] px-4 outline-none focus:border-[#315fd7] focus:ring-4 focus:ring-[#315fd7]/10"/></label><label className="block text-sm font-extrabold text-[#30457f]">Password<input type="password" required minLength={6} autoComplete={mode === "login" ? "current-password" : "new-password"} value={password} onChange={(e)=>setPassword(e.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-[#d7e0f6] px-4 outline-none focus:border-[#315fd7] focus:ring-4 focus:ring-[#315fd7]/10"/></label>{error && <p role="alert" className="rounded-xl bg-[#fff0f2] p-3 text-sm font-bold text-[#b52c49]">{error}</p>}<button disabled={busy} className="min-h-12 w-full rounded-xl bg-gradient-to-br from-[#6b2bd9] to-[#315fd7] px-5 text-sm font-extrabold text-white disabled:opacity-60">{busy ? "Working…" : mode === "login" ? "Enter Lurexa Teach" : "Create account"}</button></form><button type="button" onClick={()=>setMode(mode === "login" ? "register" : "login")} className="mt-5 min-h-11 w-full text-sm font-extrabold text-[#315fd7]">{mode === "login" ? "New to Lurexa? Create an account" : "Already have an account? Sign in"}</button></section></main>;
}
