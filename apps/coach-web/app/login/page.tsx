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

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (mode === "login") await AuthService.login(email, password);
      else await AuthService.register(email, password);
      const requested = new URLSearchParams(window.location.search).get("continue");
      const safeDestination = requested?.startsWith("/") && !requested.startsWith("//") ? requested : "/dashboard";
      router.replace(safeDestination);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "We could not complete that request.");
    } finally { setBusy(false); }
  }

  return <main className="grid min-h-screen place-items-center bg-gradient-to-br from-[#eefbff] via-[#f5f2ff] to-[#eef3ff] px-5 py-10"><section className="w-full max-w-md rounded-[32px] border border-[#dce8f5] bg-white p-7 shadow-[0_24px_70px_rgba(31,50,120,.12)] sm:p-9"><ProductMark product="coach"/><p className="mt-8 text-[10px] font-black tracking-[.18em] text-[#6b2bd9]">ONE LUREXA IDENTITY</p><h1 className="mt-3 text-3xl font-black tracking-[-.05em]">{mode === "login" ? "Continue your speaking journey." : "Create your Lurexa account."}</h1><p className="mt-3 text-sm leading-6 text-[#6677a5]">If you already use Learn or Teach, use the same account here. Coach does not create a second learner identity.</p><form onSubmit={submit} className="mt-7 space-y-4"><label className="block text-sm font-extrabold text-[#30457f]">Email<input required type="email" autoComplete="email" value={email} onChange={(event)=>setEmail(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-[#d7e0f6] px-4 outline-none focus:border-[#315fd7] focus:ring-4 focus:ring-[#315fd7]/10"/></label><label className="block text-sm font-extrabold text-[#30457f]">Password<input required type="password" minLength={6} autoComplete={mode === "login" ? "current-password" : "new-password"} value={password} onChange={(event)=>setPassword(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-[#d7e0f6] px-4 outline-none focus:border-[#315fd7] focus:ring-4 focus:ring-[#315fd7]/10"/></label>{error ? <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm font-bold text-rose-800">{error}</p> : null}<button disabled={busy} className="min-h-12 w-full rounded-xl bg-gradient-to-br from-[#6b2bd9] to-[#315fd7] px-5 text-sm font-black text-white disabled:opacity-60">{busy ? "Working…" : mode === "login" ? "Enter Lurexa Coach" : "Create Lurexa account"}</button></form><button type="button" onClick={()=>setMode(mode === "login" ? "register" : "login")} className="mt-5 min-h-11 w-full text-sm font-black text-[#315fd7]">{mode === "login" ? "New to Lurexa? Create an account" : "Already use Lurexa? Sign in"}</button></section></main>;
}
