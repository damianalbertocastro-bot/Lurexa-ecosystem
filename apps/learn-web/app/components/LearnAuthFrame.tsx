import type { ReactNode } from "react";
import { ProductMark } from "@lurexa/ui/ProductMark";

const ecosystemUrl = process.env.NEXT_PUBLIC_LUREXA_ECOSYSTEM_URL ?? "https://lurexa.com";

export function LearnAuthFrame({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#f5f7ff] text-[#0b1f5f] lg:grid lg:grid-cols-[.95fr_1.05fr]">
      <section className="relative hidden overflow-hidden bg-gradient-to-br from-[#071d67] via-[#17368f] to-[#592bd6] px-10 py-12 text-white lg:flex lg:min-h-screen lg:flex-col lg:justify-between xl:px-16">
        <div className="absolute -right-24 top-10 h-80 w-80 rounded-full bg-[#12cdd4]/20 blur-3xl" />
        <a href={ecosystemUrl} aria-label="Lurexa ecosystem" className="relative w-fit rounded-xl bg-white/95 p-3 shadow-xl">
          <ProductMark product="learn" />
        </a>
        <div className="relative max-w-xl pb-12">
          <p className="text-[11px] font-extrabold tracking-[.2em] text-[#8df4ef]">{eyebrow}</p>
          <h1 className="mt-5 text-5xl font-black leading-[.96] tracking-[-.06em] xl:text-6xl">{title}</h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-indigo-100">{description}</p>
          <div className="mt-8 flex flex-wrap gap-2 text-xs font-bold text-indigo-100">
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-2">One learner profile</span>
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-2">CEFR-aligned paths</span>
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-2">Evidence-informed support</span>
          </div>
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-8 lg:px-12">
        <div className="w-full max-w-lg">
          <a href={ecosystemUrl} aria-label="Lurexa ecosystem" className="mb-8 inline-flex rounded-xl lg:hidden">
            <ProductMark product="learn" />
          </a>
          {children}
        </div>
      </section>
    </main>
  );
}
