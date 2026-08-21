"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@lurexa/backend";
import { ProductMark } from "@lurexa/ui/ProductMark";

const ecosystemUrl = process.env.NEXT_PUBLIC_LUREXA_ECOSYSTEM_URL ?? "https://lurexa.com";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const user = await AuthService.login(email, password);
      const claims = await AuthService.getUserClaims(user);
      if (claims.role !== "super_admin") {
        await AuthService.logout();
        throw new Error("This account does not have Lurexa platform-administration access.");
      }
      router.replace("/");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to sign in.");
    } finally {
      setBusy(false);
    }
  }

  return <main className="grid min-h-screen place-items-center bg-[#f5f7ff] px-5 py-10">
    <section className="w-full max-w-md rounded-[30px] border border-[#dfe6f8] bg-white p-7 shadow-[0_24px_70px_rgba(31,50,120,.12)] sm:p-9">
      <a href={ecosystemUrl} aria-label="Lurexa ecosystem" className="inline-flex rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315fd7]"><ProductMark product="admin" /></a>
      <p className="mt-8 text-[10px] font-extrabold tracking-[.18em] text-[#315fd7]">PLATFORM ADMINISTRATION</p>
      <h1 className="mt-3 text-3xl font-black tracking-[-.05em] text-[#071d67]">Sign in to Lurexa Admin.</h1>
      <p className="mt-3 text-sm leading-6 text-[#6677a5]">Platform operations require an account with the trusted <code>super_admin</code> claim. There is no public Admin registration flow.</p>
      <form className="mt-7 space-y-4" onSubmit={submit}>
        <label className="block text-sm font-extrabold text-[#30457f]">Email<input type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-[#d7e0f6] px-4 outline-none focus:border-[#315fd7] focus:ring-4 focus:ring-[#315fd7]/10" /></label>
        <label className="block text-sm font-extrabold text-[#30457f]">Password<input type="password" required autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-[#d7e0f6] px-4 outline-none focus:border-[#315fd7] focus:ring-4 focus:ring-[#315fd7]/10" /></label>
        {error ? <p role="alert" className="rounded-xl bg-[#fff0f2] p-3 text-sm font-bold text-[#b52c49]">{error}</p> : null}
        <button disabled={busy} className="min-h-12 w-full rounded-xl bg-gradient-to-br from-[#071d67] to-[#315fd7] px-5 text-sm font-extrabold text-white disabled:opacity-60">{busy ? "Verifying access…" : "Enter Lurexa Admin"}</button>
      </form>
    </section>
  </main>;
}
