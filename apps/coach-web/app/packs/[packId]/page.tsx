import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductMark } from "@lurexa/ui/ProductMark";
import { PhoneticChip } from "@lurexa/ui/PhoneticChip";
import { COACH_PRACTICE_PACKS, CoachCatalogService, type CoachPracticePack } from "@lurexa/backend";

export function generateStaticParams() {
  return COACH_PRACTICE_PACKS.map((pack: CoachPracticePack) => ({
    packId: pack.id,
  }));
}

export default async function CoachPackRunnerPage({
  params,
}: {
  params: Promise<{ packId: string }>;
}) {
  const { packId } = await params;
  const pack = CoachCatalogService.getPackById(packId);

  if (!pack) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[var(--lx-canvas)] text-[var(--lx-ink)] pb-12">
      {/* Header */}
      <header className="border-b border-[var(--lx-border)] bg-[var(--lx-surface)] sticky top-0 z-40">
        <div className="mx-auto max-w-5xl px-5 py-4 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <ProductMark product="coach" size="sm" />
            </Link>
            <span className="text-xs font-bold text-[var(--lx-muted)]">
              / Practice Packs / {pack.cefrLevel}
            </span>
          </div>

          <Link
            href="/dashboard"
            className="rounded-xl border border-[var(--lx-border)] bg-[var(--lx-canvas)] px-3.5 py-1.5 text-xs font-bold text-[var(--lx-ink)] hover:bg-[var(--lx-border)]/40 transition"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 space-y-6">
        {/* Pack Overview Card */}
        <section className="rounded-3xl border border-[var(--lx-border)] bg-[var(--lx-surface)] p-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-black text-[var(--lx-primary)] uppercase tracking-wider">
              {pack.cefrLevel} • {pack.mode.replace("_", " ")}
            </span>
            <span className="text-xs font-bold text-[var(--lx-muted)]">
              Target: {pack.suggestedTurns} Spoken Turns
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-[-.04em]">
            {pack.title}
          </h1>
          <p className="mt-1 text-sm font-semibold text-[var(--lx-primary)]">
            {pack.subtitle}
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--lx-muted)] max-w-3xl">
            {pack.description}
          </p>

          {pack.l1InterferenceFocus && (
            <div className="mt-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4 text-xs">
              <strong className="text-amber-800 dark:text-amber-300">L1 Transfer Focus: </strong>
              <span className="text-amber-950 dark:text-amber-100">{pack.l1InterferenceFocus}</span>
            </div>
          )}

          {/* Scenario Details */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-[var(--lx-canvas)] p-4 border border-[var(--lx-border)] text-xs">
              <p className="font-bold uppercase tracking-wider text-[var(--lx-muted)] mb-1">Your Partner:</p>
              <p className="font-semibold text-sm text-[var(--lx-ink)]">{pack.scenarioRole}</p>
            </div>
            <div className="rounded-2xl bg-[var(--lx-canvas)] p-4 border border-[var(--lx-border)] text-xs">
              <p className="font-bold uppercase tracking-wider text-[var(--lx-muted)] mb-1">Your Mission Goal:</p>
              <p className="font-semibold text-sm text-[var(--lx-ink)]">{pack.learnerGoal}</p>
            </div>
          </div>

          {/* Target Phonetics */}
          <div className="mt-6">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--lx-muted)] mb-2">Target Phonemes:</p>
            <div className="flex flex-wrap gap-2">
              {pack.targetPhonemes.map((ph: string) => (
                <PhoneticChip key={ph} ipa={`/${ph}/`} example={ph} category="consonant" />
              ))}
            </div>
          </div>

          {/* Starter Phrases */}
          <div className="mt-6 border-t border-[var(--lx-border)] pt-6">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--lx-muted)] mb-3">Useful Starter Phrases:</p>
            <ul className="space-y-2 text-xs text-[var(--lx-ink)]">
              {pack.starterPhrases.map((phrase: string) => (
                <li key={phrase} className="rounded-xl bg-[var(--lx-canvas)] px-3.5 py-2 border border-[var(--lx-border)]">
                  • “{phrase}”
                </li>
              ))}
            </ul>
          </div>

          {/* Launch Action */}
          <div className="mt-8 pt-4 flex items-center justify-between">
            <Link
              href="/studio"
              className="rounded-2xl bg-gradient-to-r from-[var(--lx-accent)] to-[var(--lx-accent)] px-8 py-3.5 text-xs font-black uppercase tracking-wider text-[var(--color-brand-navy)] shadow-md hover:opacity-90 transition active:scale-95 flex items-center gap-2"
            >
              <span>🎙️</span>
              <span>Launch Practice Studio</span>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
