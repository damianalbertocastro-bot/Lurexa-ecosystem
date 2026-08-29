"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@lurexa/backend";
import { Button } from "@lurexa/ui/button";
import { Card } from "@lurexa/ui/card";
import { ProductMark } from "@lurexa/ui/ProductMark";
import { Input } from "@lurexa/ui/Input";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      const user = await AuthService.login(email.trim(), password);
      const claims = await AuthService.getUserClaims(user);
      if (claims.role !== "super_admin") {
        await AuthService.logout();
        throw new Error("This account does not have Lurexa Admin access.");
      }
      router.replace("/");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to sign in to Lurexa Admin.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-br from-[#eef2ff] via-white to-[#e9fbff] px-5 py-10 text-[var(--color-brand-navy)]">
      <div className="w-full max-w-md">
        <div className="mb-7 flex justify-center">
          <ProductMark product="admin" />
        </div>
        <Card title="Sign in to Lurexa Admin" subtitle="Platform operations are restricted to verified superadmin accounts.">
          <form className="space-y-4 pt-2" onSubmit={(event) => void submit(event)}>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-bold text-[#20356f]">Email</label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="min-h-12 w-full rounded-xl border border-[#d8e0f6] bg-white px-3.5 text-sm text-[var(--color-brand-navy)] outline-none transition focus:border-[#6a5af9] focus:ring-4 focus:ring-[#6a5af9]/10"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-bold text-[#20356f]">Password</label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="min-h-12 w-full rounded-xl border border-[#d8e0f6] bg-white px-3.5 text-sm text-[var(--color-brand-navy)] outline-none transition focus:border-[#6a5af9] focus:ring-4 focus:ring-[#6a5af9]/10"
              />
            </div>
            {error ? <p role="alert" className="rounded-xl bg-rose-50 px-3.5 py-3 text-sm font-semibold text-rose-700">{error}</p> : null}
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>
          <p className="mt-5 text-xs leading-5 text-[#64749b]">
            Lurexa Admin access is enforced again by Lurexa Core on every platform API request. Signing in alone does not grant platform privileges.
          </p>
        </Card>
      </div>
    </main>
  );
}
