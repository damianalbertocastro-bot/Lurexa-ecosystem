"use client";

import { useEffect, useState } from "react";
import { evaluateTeachCredential, TeachService } from "@lurexa/backend";
import type { TeachCredentialAward, TeachCredentialDefinition, TeachEnrollment, TeachEvidenceSubmission } from "@lurexa/types";
import { TeachShell } from "../components/TeachShell";
import { TeachPrivate } from "../components/TeachPrivate";
import { useTeachAuth } from "../components/TeachAuthProvider";

import Link from "next/link";
import { Button } from "@lurexa/ui/Button";

export default function CertificationsPage() {
  const { user, profile } = useTeachAuth();
  const [definitions, setDefinitions] = useState<TeachCredentialDefinition[]>([]);
  const [awards, setAwards] = useState<TeachCredentialAward[]>([]);
  const [enrollments, setEnrollments] = useState<TeachEnrollment[]>([]);
  const [evidence, setEvidence] = useState<TeachEvidenceSubmission[]>([]);
  const [error, setError] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      TeachService.listCredentialDefinitions(),
      TeachService.listCredentialAwards(user.uid),
      TeachService.listEnrollments(user.uid),
      TeachService.listEvidence(user.uid),
    ])
      .then(([a, b, c, d]) => {
        setDefinitions(a);
        setAwards(b);
        setEnrollments(c);
        setEvidence(d);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Credentials could not be loaded."));
  }, [user]);

  const copyShareLink = async (code: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = `${origin}/verify/${code}`;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      }
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2500);
    } catch {
      // safe fallback
    }
  };

  const getLinkedInCertUrl = (credName: string, code: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://lurexa.com";
    const certUrl = `${origin}/verify/${code}`;
    return `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(credName)}&organizationName=${encodeURIComponent("Lurexa Learning Technologies")}&certUrl=${encodeURIComponent(certUrl)}&certId=${encodeURIComponent(code)}`;
  };

  return (
    <TeachShell active="Credentials">
      <TeachPrivate>
        <main className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8">
          <section className="grid gap-7 lg:grid-cols-[1fr_.75fr] lg:items-end">
            <div>
              <p className="text-[11px] font-extrabold tracking-[.18em] text-[var(--lx-primary)]">
                CREDENTIALS &amp; PROFESSIONAL EVIDENCE
              </p>
              <h1 className="mt-3 max-w-3xl text-4xl font-black tracking-[-.055em] sm:text-6xl text-[var(--color-brand-navy)]">
                Credentials should represent demonstrated capability.
              </h1>
            </div>
            <p className="max-w-xl text-base leading-7 text-[var(--lx-muted)]">
              Eligibility is calculated from persistent course progress, verified evidence, competency state, and CEFR level. Awarding remains a trusted Core action rather than a client-side button.
            </p>
          </section>

          {error && (
            <p role="alert" className="mt-6 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-sm font-bold text-rose-800">
              {error}
            </p>
          )}

          <section className="mt-9 grid gap-6 md:grid-cols-2">
            {definitions.map((credential, i) => {
              const awarded = awards.find((item) => item.credentialId === credential.id);
              const result = evaluateTeachCredential(credential, profile, enrollments, evidence);
              const met = result.requirements.filter((item) => item.met).length;
              const verificationCode = awarded?.verificationCode ?? awarded?.id ?? `LX-${credential.id.toUpperCase()}`;

              return (
                <article
                  key={credential.id}
                  className={`flex flex-col justify-between rounded-[28px] border bg-[var(--lx-surface)] p-7 shadow-sm transition hover:shadow-md ${
                    awarded ? "border-[var(--lx-secondary)] ring-1 ring-[var(--lx-secondary)]/20" : "border-[var(--lx-border)]"
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <span
                        className={`grid h-14 w-14 place-items-center rounded-2xl text-xl font-black ${
                          awarded
                            ? "bg-gradient-to-br from-[var(--lx-primary)] to-[var(--lx-secondary)] text-white shadow-sm"
                            : i % 2
                            ? "bg-[var(--lx-canvas)] text-[var(--lx-secondary)] border border-[var(--lx-border)]"
                            : "bg-[var(--lx-canvas)] text-[var(--lx-primary)] border border-[var(--lx-border)]"
                        }`}
                      >
                        {awarded ? "🎖️" : "✦"}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-extrabold border ${
                          awarded
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                            : result.eligible
                            ? "bg-indigo-50 text-indigo-800 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800"
                            : "bg-[var(--lx-canvas)] text-[var(--lx-muted)] border-[var(--lx-border)]"
                        }`}
                      >
                        {awarded ? "✓ Awarded & Verified" : result.eligible ? "★ Ready to Award" : "In Progress"}
                      </span>
                    </div>

                    <h2 className="mt-6 text-2xl font-black tracking-[-.04em] text-[var(--color-brand-navy)]">
                      {credential.name}
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-[var(--lx-muted)]">
                      {credential.description}
                    </p>

                    <div className="mt-6 border-t border-[var(--lx-border)] pt-5">
                      <div className="flex items-center justify-between gap-3">
                        <b className="text-sm text-[var(--lx-secondary)] font-extrabold">
                          {met} of {result.requirements.length} requirements met
                        </b>
                        {awarded && (
                          <span className="text-xs font-bold text-[var(--lx-muted)]">
                            Awarded {new Date(awarded.awardedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      <div className="mt-4 space-y-2">
                        {credential.requirements.map((requirement) => {
                          const state = result.requirements.find((item) => item.requirementId === requirement.id)?.met;
                          return (
                            <div
                              key={requirement.id}
                              className="flex items-center gap-3 rounded-xl bg-[var(--lx-canvas)] p-3 border border-[var(--lx-border)]"
                            >
                              <span
                                className={`grid h-7 w-7 place-items-center rounded-lg text-xs font-black ${
                                  state
                                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200"
                                    : "bg-[var(--lx-surface)] text-[var(--lx-muted)] border border-[var(--lx-border)]"
                                }`}
                              >
                                {state ? "✓" : "·"}
                              </span>
                              <span className="text-sm font-bold capitalize text-[var(--color-brand-navy)]">
                                {requirement.type.replaceAll("-", " ")}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {result.eligible && !awarded && (
                        <p className="mt-4 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-sm font-bold text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200 dark:border-emerald-800">
                          All requirements are satisfied. The credential is queued for trusted administrative issuance.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Shareable Credential Actions */}
                  {awarded && (
                    <div className="mt-6 border-t border-[var(--lx-border)] pt-5 space-y-3">
                      <div className="flex items-center justify-between text-xs text-[var(--lx-muted)]">
                        <span>Verification code:</span>
                        <code className="font-mono font-bold text-[var(--lx-primary)] bg-[var(--lx-canvas)] px-2 py-0.5 rounded border border-[var(--lx-border)]">
                          {verificationCode}
                        </code>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => copyShareLink(verificationCode)}
                          className="flex-1 text-xs font-extrabold"
                        >
                          {copiedCode === verificationCode ? "✓ Link Copied!" : "📋 Copy Verification Link"}
                        </Button>

                        <a
                          href={getLinkedInCertUrl(credential.name, verificationCode)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[var(--lx-border)] bg-[var(--lx-canvas)] px-3.5 py-2.5 text-xs font-extrabold text-[var(--color-brand-navy)] hover:bg-[var(--lx-surface)] transition shadow-sm"
                        >
                          <span className="text-sky-600 font-black">in</span> Add to LinkedIn
                        </a>

                        <Link
                          href={`/verify/${verificationCode}`}
                          className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[var(--lx-primary)] to-[var(--lx-secondary)] px-3.5 py-2.5 text-xs font-extrabold text-white hover:opacity-90 transition shadow-sm"
                        >
                          👁️ View Certificate
                        </Link>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </section>

          {!definitions.length && (
            <div className="mt-8 rounded-[28px] border border-dashed border-[var(--lx-border)] bg-[var(--lx-surface)] p-8 text-center text-sm text-[var(--lx-muted)]">
              Credential definitions are loading or have not been published yet.
            </div>
          )}

          <section className="mt-8 grid gap-5 lg:grid-cols-[.8fr_1.2fr]">
            <article className="rounded-[28px] bg-gradient-to-br from-[var(--color-brand-navy)] to-[var(--lx-secondary)] p-7 text-white shadow-md">
              <p className="text-[10px] font-extrabold tracking-[.17em] text-[var(--lx-accent)]">CREDENTIAL WALLET</p>
              <h2 className="mt-3 text-3xl font-black tracking-[-.045em]">
                {awards.length} verified credential{awards.length === 1 ? "" : "s"}
              </h2>
              <p className="mt-3 text-sm leading-6 text-indigo-100">
                Credential awards are persistent trusted records connected to your educator profile.
              </p>
            </article>

            <article className="rounded-[28px] border border-[var(--lx-border)] bg-[var(--lx-surface)] p-7 shadow-sm">
              <p className="text-[10px] font-extrabold tracking-[.17em] text-[var(--lx-primary)]">TRUST MODEL</p>
              <h2 className="mt-3 text-2xl font-black text-[var(--color-brand-navy)]">
                Eligibility can be transparent without making awards self-service.
              </h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  ["1", "Clear competency"],
                  ["2", "Verified evidence"],
                  ["3", "Trusted award"],
                ].map(([n, t]) => (
                  <div key={n} className="rounded-2xl bg-[var(--lx-canvas)] border border-[var(--lx-border)] p-5">
                    <b className="text-lg text-[var(--lx-primary)]">{n}</b>
                    <p className="mt-2 text-sm font-extrabold text-[var(--color-brand-navy)]">{t}</p>
                  </div>
                ))}
              </div>
            </article>
          </section>
        </main>
      </TeachPrivate>
    </TeachShell>
  );
}
